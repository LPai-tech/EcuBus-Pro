import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    canConnect: false,
    doipConnect: false,
    linConnect: false,
    logLevel:'info',
    /*addr*/
    canAddrTable: [],
    doipAddrTable: [],
    linAddrTable: [], 
    lpAddrTable:[{
      name:'emulate-lp',
      SA:0,
      TA:1
    }],
    tableErrorIndex:[-1,-1],
    /* service */ 
    canTable: [],
    doipTable: [],
    lpTable: [],
    linTable: [],
    running: false,
    udsProject:{
      name:'',
      can:[],
      eth:[],
      lin:[],
      simulate:[],
      fileList:[],
      version:''
    },
    udsProjectPath:''

  },
  mutations: {
    addSch(state,mode){
      state[mode+'Table'].push({
        name:'sch'+(state[mode+'Table'].length+1),
        addr:'',
        services:[]
      })
    },
    setUdsProject(state,mode){
      Vue.set(state.udsProject,mode.key,mode.val);
    },
    setUdsProjectPath(state,mode){
      state.udsProjectPath=mode
    },
    logLevel(state,level){
      state.logLevel=level
    },
    setTableError(state,index){
      state.tableErrorIndex=index
    },
    runChange(state, run) {
      state.running = run
    },
    /* connect*/
    canChange(state, connect) {
      state.canConnect = connect
    },
    doipChange(state, connect) {
      state.doipConnect = connect
    },
    linChange(state, connect) {
      state.linConnect = connect
    },
    /* doip addr table */
    doipAddrAdd(state, item) {
      state.doipAddrTable.push(item)
    },
    doipAddrDelete(state, index) {
      state.doipAddrTable.splice(index, 1)
    },
    doipAddrDeleteKey(state, key) {
      for (var i in state.doipAddrTable) {
        if (state.doipAddrTable[i].key === key) {
          state.doipAddrTable.splice(i, 1)
          break
        }
      }
      if (state.doipAddrTable.length === 0) {
        state.doipConnect = false
      }
    },
    doipAddrLoad(state, data) {
      Vue.set(state,"doipAddrLoad",data);
    },
    /* can addr table */
    canAddrAdd(state, item) {
      state.canAddrTable.push(item)
    },
    canAddrDelete(state, index) {
      state.canAddrTable.splice(index, 1)
    },
    canAddrLoad(state, data) {
      Vue.set(state,"canAddrTable",data);
    },
    /* lin addr table */
    linAddrAdd(state, item) {
      state.linAddrTable.push(item)
    },
    linAddrDelete(state, index) {
      state.linAddrTable.splice(index, 1)
    },
    linAddrLoad(state, data) {
      Vue.set(state,"linAddrTable",data);
    },
    /*can table*/
    canTableLoad(state, data) {
      Vue.set(state,"canTable",data);
      Vue.set(state.udsProject,"can",data);
    },
    /*lin table*/
    linTableLoad(state, data) {
      Vue.set(state,"linTable",data);
      Vue.set(state.udsProject,"lin",data);
    },
    /*doip table*/
    doipTableLoad(state, data) {
      Vue.set(state,"doipTable",data);
      Vue.set(state.udsProject,"eth",data);
    },
    /*loopback table*/
    lpTableLoad(state, data) {
      Vue.set(state,"lpTable",data);
      Vue.set(state.udsProject,"simulate",data);
    },
  },
  actions: {

  }
})
