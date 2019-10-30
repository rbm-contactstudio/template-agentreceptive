<template>
  <div>
    <CsHeader />
    <div class="container-fluid cs-content" v-if="getContact">
      <CsClient />
    </div>
    <div class="container-fluid cs-content" v-if="createContact && !getContact">
      <div class="container-fluid">
        <fieldset>
          <legend>Criar Contato</legend>
          <CsCreateContact :form="formNewContact" contact-point-field="TELEFONE" />
        </fieldset>
      </div>
    </div>
    <CsAlert />
    <CsSnapshot />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { CsEvents, CsAlert, CsHeader, CsSnapshot, CsCreateContact } from '@contactstudio/agent-tools';
  import CsClient from './CsClient.vue';

  export default {
    components: {
      CsAlert,
      CsHeader,
      CsSnapshot,
      CsClient,
      CsCreateContact
    },
    data(){
      return {
        createContact: true,
        formNewContact: [
          {label: 'Nome', typeField: 'TEXTO', model: 'NOME', valid: true, required: true, options: {placeholder: ''}, errorField: 'Nome inválido.', classe: 'form-group'},
          {label: 'Telefone', typeField: 'TEXTO', model: 'TELEFONE', valid: true, required: true, options: {placeholder: '', size: 3}, errorField: 'Telefone inválido.', classe: 'form-group'},
        ]
      }
    },
    created(){
      this['set-session'](this.getSessionCs());
      this['get-user']();
    },
    watch:{
      getSnapshot: 'validateChanges',
      getUser: 'treatDataUser',
    },
    computed: Object.assign({},
      mapGetters('lib/', ['getSnapshot', 'getSession', 'getContact', 'getUser', 'getStatus', 'getNextStatus']),
      mapGetters([]),
      {
        queryWS(){
          return `?cssession=${this.getSession}`;
        }
      }
    ),
    methods: Object.assign({},
      mapActions('lib/', [
        'set-session', 'set-errorsession', 'get-user', 'set-contact',
        'set-status'
      ]),
      mapActions([]),
      {
        treatDataUser(){
          if(this.getUser.info_agente.service.auto_available){
            setTimeout(() => {
              if(this.getStatus == 'Indefinido' && this.getNextStatus == 'Disponível'){
                this.setAvailable();
              }
            }, 1000);
          }
        },
        setAvailable(){
          this['set-status']('Disponível');
        },
        validateChanges(snap){
          if(snap.to_kill == '1'){
            let text = snap.to_kill_origin && snap.to_kill_origin != 'UNSOLICITED' ? `Deslogado pelo usuário "${snap.to_kill_origin}".` : 'Deslogado por meio desconhecido.';
            this['set-errorsession'](text);
          }
          if(snap.contacts && snap.contacts.length > 0){
            this['set-contact'](snap.contacts[0]);
          }
          else{
            this['set-contact'](null);
          }
          CsEvents.$emit('ChangeSnapshot', snap);
        },
        getQueryString(){
          let result = {};
          if(location.search.length > 0){
            let pairs = (location.search).slice(1).split('&');
            for(let idx in pairs){
              let pair = pairs[idx].split('=');
              if(pair[0]){
                result[pair[0].toLowerCase()] = decodeURIComponent(pair[1] || '');
              }
            }
          }
          return result;
        },
        getCookies(){
          let cookies = document.cookie;
          if (cookies) {
            cookies = cookies.replace(/;[ ]/gi, '","');
            cookies = '{"' + cookies.replace(/=/gi, '":"') + '"}';
            return JSON.parse(cookies);
          }
          return {};
        },
        getSessionCs(){
          let allQueryString = this.getQueryString();
          let allCookies = this.getCookies();
          return allQueryString['cssession'] ? allQueryString['cssession'] : allCookies['cssession'];
        }
      }
    )
  }
</script>

<style lang="scss">
  hr{
    border-top: 1px solid #ccc;
  }
  .cs-content{
    margin-top: 60px;
    padding: 6px 4px !important;
  }
  .cs-btn-facility{
    border: 1px solid #cccccc;
    border-radius: 3px;
    cursor: pointer;
    display: inline-block;
    margin: 0 2px;
    background: #e5ffdb;
    .glyphicons{
      font-size: 1.4em;
    }
    &:hover{
      background-color: #2f402f;
      border-color: #2f402f;
      color: #F2F2F2;
    }
  }
</style>
