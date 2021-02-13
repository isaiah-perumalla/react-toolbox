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

function filterObj(obj, predicate) {
  return Object.entries(obj).reduce((acc, [k,v]) => {
    if(predicate(k,v)) {
      acc[k] = v;
    }
    return acc;
  }, {});
}
function Describe(d) {
  
  function toHtml(data, level=0) {
    
      let className = `level_${level}`;
      if(Array.isArray(data)) {
        return e('ol', {className: className}, data.map((item,i) => e('li', {key: `${i}_${Date.now()}`}, toHtml(item, level+1))))
      }
      if((typeof data) === 'object') {
      return  e('dl', {className: className}, 
                  Object.entries(data).flatMap(([k,v]) => {
                    let vKey = `${k}_${v}`;
                      return e('div', null, e('dt', {key: k, className: className}, k), e('dd', {key: vKey}, toHtml(v, level+1)));
      } ));
    }
    return data;
  }
  
  return [toHtml(filterObj(d, (k,v) => (typeof v) != 'object')), toHtml(filterObj(d, (k,v) => (typeof v) == 'object'), 1)];
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
              symbol_: 'GBP/USD',
              requestId_: 'test-1',
              symbol_1_: 'JPY/USD',
              requestId_1_: 'test-1',
              symbol_2_: 'GBP/EUR',
              requestId_2_: 'test-1dfaf',
              executionId_: 'ewrwer',
              quoteId_: 'fsdfafa',
              transactTime_: 'fasdfadf',
              
              requestId: 'test-1',
              symbol: 'GBP/USD',
              symbol_1: 'JPY/USD',
              symbol_2: 'GBP/EUR',
              requestId_1: 'test-1',
              requestId_2: 'test-1dfaf',
              executionId: 'ewrwer',
              quoteId: 'fsdfafa',
              transactTime: 'fasdfadf',
              legs: [ 
                      { legRefID : 'leg-12-abc', tenor: '1M', qty: 1000.50, side: 'buy', valueDate: '20201215',
                        allocations: [
                          {allocId: 'alloc1', qty:5000, account: 'fafda'},
                          {allocId: 'alloc2', qty:10000, account: 'account-3'},
                      ]},
                      { legRefID : 'leg-200-ff', tenor: '2M', qty: 5999.50, side: 'sell',
                      allocations: [
                        {allocId: 'alloc1', qty:5000, account: 'fafda'},
                        {allocId: 'alloc2', qty:10000, account: 'account-3'}]},
                      { legRefID : 'leg-12dfadfa', tenor: '3MM', qty: 9999.50, side: 'Sell',valueDate: '20201215'},
                      { legRefID : 'leg-400', tenor: '6MM', qty: 8999.50, side: 'sell',valueDate: '20201215'}
                    ],
              parties: [
                { partyId : 'leg-1abc', partyRole: '1FDSDDSFSM', partyType: 1000.50, partyClassifier: 'buy'},
                { partyId : 'leg-12-abc', partyRole: '1M', partyType: 1000.50, partyClassifier: 'buDFSDFSDFy'},
                { partyId : 'leg-12-abc', partyRole: '1M', partyType: 1000.50, partyClassifier: 'buy'},
                { partyId : 'leg-12-ADSASDASDabc', partyRole: '1M', partyType: 1000.50, partyClassifier: 'buy'},
              ]
    }
  ReactDOM.render(
      [
        e('section', null, e('h1', null, 'Details-1'), e(Describe, data)), 
        e('section', null, e('h1', null, 'Details-2'), e(Describe, data))], 
          document.getElementById('request'));