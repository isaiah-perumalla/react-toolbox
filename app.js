'use strict';

const e = React.createElement;
class RfsRequest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {symbol: props.symbol, requestId: props.requestId, legs : []};
        this.requestSend = this.requestSend.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
        this.setLegs = this.setLegs.bind(this);
    }

    requestSend(event) {
      event.preventDefault();
    }

    handleChangeField(event, fieldName) {
      let newValue = event.target.value;
      let current = this.state;
      current[fieldName] = newValue;
      this.setState(current);
    }

    setLegs(legs) {

    }

    render() {
      console.log(this.state);
      let changeField = (fieldName) => (e) => { this.handleChangeField(e, fieldName)};
        data = {tableName: 'Batch Legs', 
                cols: ['legRefID', 'tenor', 'valueDate', 'fixingDate', 'qty', 'side', 'account'], 
                rowKey: (leg) => leg.legRefID, 
                data: this.props.legs};
        
        return e('fieldset', {}, 
                e('legend', {}, 'Rfs Request'),
                e(MutableTable, data),
                e('div', {className: 'send-request'}, 
                LabelText({name: 'Symbol:', onChange: changeField('symbol'), value: this.state.symbol}),
                LabelText({name: 'ReqId:', onChange: changeField('requestId'), value: this.state.requestId}),
                e('input', {type: 'submit', value : 'send request', onClick: this.requestSend})));        
    }
}

class MutableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rows:this.props.data}
    this.addRow = this.addRow.bind(this);
    this.clear = this.clear.bind(this);
  }

  clear(event) {
    this.setState({rows: []});

  }

  addRow(r) {
    let rows = this.state.rows;
    rows.push(r);
    this.setState({rows: rows});
  }
  render() {
    let tableProps = {cols: this.props.cols, rowKey: this.props.rowKey, data: this.state.rows};
    
    return e('fieldset', null, 
      e('legend', {}, this.props.tableName),
      e(MutableRow, {cols: tableProps.cols, addRow: this.addRow}),
        Table(tableProps),
        e('input', {onClick :this.clear, type: 'submit', value: 'clear'}));
  }
}

class MutableRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleChangeLegField = this.handleChangeField.bind(this);
    this.state = {};
}

handleAdd(event) {
  
  let row = this.state;
  this.props.addRow(row);
  console.log(this.state);
  this.setState({});
  console.log(this.state);
  event.preventDefault();
}

handleChangeField(event, fieldName) {
    let newValue = event.target.value;
    let current = this.state;
    current[fieldName] = newValue;
    this.setState(current);
}

  render() {
    let changeField = (fieldName) => (e) => { this.handleChangeField(e, fieldName)};
   
    let mutableFields = this.props.cols.map(c => LabelText({key: c, name: c, onChange: changeField(c), value: this.state[c]}))
    return  e('div', {className: 'mutable-row'}, 
              mutableFields,
              e('input', {type: 'submit', onClick: this.handleAdd, value: 'add leg'}));
  }
}
function LabelText(props) {
    let name = props.name;
    let value = props.value;
    let key = props.key == null ? props.name : props.key;
    let readOnly = (props.onChange == null) ? true : false;
    let onTxtChange = readOnly ? (e) => {} : props.onChange;
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