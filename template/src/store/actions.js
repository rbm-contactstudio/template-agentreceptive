import Vue from 'vue';

const api = '/csapi/v2';

const actions = {
  loadExpertise(store, exp){
    return Vue.http.get(`${api}/expertise?expertise_name=${exp}`).then(ret => {
      return ret;
    });
  },
  saveExpertise(store, data){
    return Vue.http.post(`${api}/expertise_class`, JSON.stringify(data)).then(ret => {
      return ret;
    }, err => {
      return err;
    });
  },
  saveTabulation(store, obj){
    let tab = JSON.stringify(obj.tabulation);
    return Vue.http.patch(`/csapi/v2/contact/${obj.contact_id}/tab`, tab).then(ret => {
      return ret;
    }, err => {
      return err;
    });
  },
  clearContact(store, obj){
    return Vue.http.delete(`/csapi/v2/contact/${obj.contact_id}`).then(ret => {
      return ret;
    }, err => {
      return err;
    });
  },
  loadHistory(store, contact_id){
    return Vue.http.post(`/csapi/v2/chat_classifications/${contact_id}`, null).then(ret => {
      return ret;
    }, err => {
      return err;
    });
  }
};

export default actions;