'use strict';

const e = React.createElement;
class RfsRequest extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        // return e('div', {className: 'request-rfs'}, 
        //         e('label', {htmlFor:'symbol'}, 'symbol'),
        //         e('input', {type: 'text', id: 'symbol', name: 'symbol'}));
        data = {tableName: 'Batch Legs', 
                cols: ['legRefID', 'tenor', 'valueDate', 'fixingDate', 'qty', 'side', 'account'], 
                rowKey: (leg) => leg.legRefID, 
                data: this.props.legs};
        
        return e('fieldset', {}, 
                e('legend', {}, 'Rfs Request'),
                LabelText({name: 'Symbol:', value: this.props.symbol}),
                LabelText({name: 'ReqId:', value: this.props.requestId}),
                e(MutableTable, data));        
    }
}

class MutableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rows:this.props.data}
  }

  render() {
    let tableProps = {cols: this.props.cols, rowKey: this.props.rowKey, data: this.state.rows};
    
    return e('fieldset', {}, 
      e('legend', {}, this.props.tableName),
      e(MutableRow, {cols: tableProps.cols}),
        Table(tableProps));
  }
}

class MutableRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleAdd = this.handleAdd.bind(this);
    this.handleChangeLegField = this.handleChangeLegField.bind(this);
}

handleAdd(event) {
  event.preventDefault();
}

handleChangeLegField(event, fieldName) {
    let newValue = event.target.value;
    let current = this.state;
    current[fieldName] = newValue;
    this.setState(current)
    console.log(this.state);
    

}

  render() {
    let changeField = (fieldName) => (e) => { this.handleChangeLegField(e, fieldName)};
   
    let mutableFields = this.props.cols.map(c => LabelText({key: c, name: c, onChange: changeField(c), value: this.state[c]}))
    return e('fieldset', null, 
           e('legend', null, 'add leg'),
            e('form', {onSubmit: this.handleAdd}, 
              mutableFields,
              e('input', {type: 'submit', value: 'add leg'})));
  }
}
function LabelText(props) {
    let name = props.name;
    let value = props.value;
    let key = props.key == null ? props.name : props.key;
    let readOnly = (props.onChange == null) ? true : false;
    let onTxtChange = readOnly ? (e) => {} : props.onChange;
    console.log('key for ' + props.name + ' is = ' + key);
    var inputElement = null;
    if(readOnly) {
      inputElement = e('input', { type: 'text', readOnly: true, id: name, name: name, value: value});
    }
    else {
      inputElement = e('input', { type: 'text', onChange: onTxtChange, id: name, name: name, defaultValue: value});
    }
    

    return e('div', {key: key + '_div', className: 'label-text'}, 
                e('label', { htmlFor: name}, name),
                inputElement);
}


  
/*
  props = {cols: [col_1, col_2 ,...],
           data: [{key: rowKey, col_1: val_1, col_2: val2 ... }]}
*/
function Table(props) {
  
  function tr(key, data) {
    let cells = props.cols.map(c => e('td', {key: key+'_'+c}, data[c]));
    return e('tr', {key: key}, cells);
  }
  
  let headers = props.cols.map((c) => e('th', {key: c}, c));
  let tableRows = props.data.map((row) => tr(props.rowKey(row), row));
  
  return e('table', {}, 
          e('thead', {}, 
            e('tr', {}, 
              headers)),
              e('tbody', {}, tableRows));    
}

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked comment number ' + this.props.commentID;
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}

// Find all DOM containers, and render Like buttons into them.
document.querySelectorAll('.like_button_container')
  .forEach(domContainer => {
    // Read the comment ID from a data-* attribute.
    const commentID = parseInt(domContainer.dataset.commentid, 10);
    ReactDOM.render(
      e(LikeButton, { commentID: commentID }),
      domContainer
    );
  });
  let data = {
              symbol: 'GBP/USD',
              requestId: 'test-1',
              legs: [ 
                      { legRefID : 'leg-12-abc', tenor: '1M', qty: 1000.50, side: 'buy'},
                      { legRefID : 'leg-200-ff', tenor: '2M', qty: 5999.50, side: 'sell'},
                    ]
    }
  ReactDOM.render(
      e(RfsRequest, data), document.getElementById('request'));