<template>
  <div>
    <div class="cs-title">Tabulação</div>
    <form class="row">
      <div class="form-group" :class="getColClass(12)" v-if="showNote">
        <div>
          <label :class="classLabel">{{ labelNote }}</label>
          <textarea spellcheck="true" v-model="note" class="cs-textarea" :class="classInput"></textarea>
        </div>
      </div>
      <div class="form-group" :class="getColClass()" v-if="showGroup">
        <div :class="{'has-error': !groupSelected}">
          <label :class="classLabel">{{ labelGroup }}</label>
          <select v-model="groupSelected" :class="classInput">
            <option value="" selected>Selecione...</option>
            <option v-for="(group, idx) in groupsOfTabulation" :key="idx" :value="group">{{ group.label }}</option>
          </select>
          <span v-show="!groupSelected" class="help-block msg_footer">Campo obrigatório</span>
        </div>
      </div>
      <div class="form-group" :class="getColClass()">
        <div :class="{'has-error': !tabulation}">
          <label :class="classLabel">{{ labelTabulation }}</label>
          <select v-model="tabulation" @change="updateTab" :class="classInput">
            <option value="" selected>Selecione...</option>
            <option v-for="(tab, idx) in tabulations" :key="idx" :value="tab">{{ tab.label }}</option>
          </select>
          <span v-show="!tabulation" class="help-block msg_footer">Campo obrigatório</span>
        </div>
      </div>
      <div class="form-group" :class="getColClass()" v-show="tabulation && tabulation.acao && (tabulation.acao.tipo == 'AGENDADOR' || tabulation.acao.tipo == 'AFFINITY')">
        <div :class="{'has-error': errorData}">
          <label :class="classLabel">* Data</label>
          <input type="date" v-model="dataAgendamento" :class="classInput">
          <span v-show="!dataAgendamento || errorData" class="help-block msg_footer">{{ errorDataText }}</span>
        </div>
      </div>
      <div class="form-group" :class="getColClass()" v-show="tabulation && tabulation.acao && (tabulation.acao.tipo == 'AGENDADOR' || tabulation.acao.tipo == 'AFFINITY')">
        <div :class="{'has-error': errorHora}">
          <label :class="classLabel">* Hora</label>
          <input type="time" v-model="horaAgendamento" :class="classInput">
          <span v-show="!horaAgendamento || errorHora" class="help-block msg_footer">{{ errorHoraText }}</span>
        </div>
      </div>
      <div class="form-group" :class="getColClass()" :required="tabulation && tabulation.acao && (tabulation.acao.tipo == 'AFFINITY' && tabulation.acao.affinity_with)" v-show="tabulation && tabulation.acao && (tabulation.acao.tipo == 'AFFINITY' && tabulation.acao.affinity_with && tabulation.acao.usuario_seleciona_destino)">
        <div :class="{'has-error': errorAffinity}">
          <label class="labelForm">* Enviar Para</label>
          <select class="form-control" v-model="affinityTo">
            <option value="" selected="selected">Selecione...</option>
            <option v-for="(affinity, idx) in affinities" :key="idx" :value="affinity.nome">{{ affinity.label || affinity.nome }}</option>
          </select>
          <span v-show="!affinityTo || errorAffinity" class="help-block msg_footer">Campo obrigatório</span>
        </div>
      </div>
      <div class="form-group" :class="getColClass()" v-show="tabulation && tabulation.acao && (tabulation.acao.tipo == 'AGENDADOR' || tabulation.acao.tipo == 'AFFINITY')">
        <div>
          <label :class="classLabel">Telefone</label>
          <input v-model="telAgendamento" :class="classInput">
        </div>
      </div>
    </form>
    <div :class="classBtnContainer">
      <button type="button" :class="classBtn" v-bind:disabled="!tabulation || tabulated" @click="tabulate">{{ textBtn }}</button>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';
  import { CsEvents } from '@contactstudio/agent-tools';

  export default {
    props:{
      beforeTabulate:{
        type: Function,
        required: false
      },
      columns: {
        type: Number,
        default: 2
      },
      textBtn:{
        type: String,
        default: 'Tabular'
      },
      classLabel: {
        type: String,
        required: false
      },
      classInput: {
        type: String,
        default: 'form-control'
      },
      classBtn: {
        type: String,
        default: 'btn btn-primary'
      },
      classBtnContainer: {
        type: String,
        default: 'text-center'
      },
      labelNote: {
        type: String,
        default: 'Observações'
      },
      showNote: {
        type: Boolean,
        default: true
      },
      noteHeight: {
        type: String,
        required: false
      },
      showGroup: {
        type: Boolean,
        default: true
      },
      labelGroup: {
        type: String,
        default: '* Grupo de Tabulação'
      },
      labelTabulation: {
        type: String,
        default: '* Tabulação'
      },
      affinityCustom:{
        type: Boolean,
        required: false
      }
    },
    data(){
      return {
        tabulated: false,
        group: "",
        groupLabel: "",
        tabulation: "",
        groupSelected: "",
        errorsTab: [],
        groupsOfTabulation: [],
        affinities: [],
        affinityList: {},
        note: null,
        order: null,
        dataAgendamento: null,
        horaAgendamento: null,
        telAgendamento: null,
        errorTabulacao: false,
        errorTelefone: false,
        errorData: false,
        errorHora: false,
        errorDataText: 'Campo obrigatório',
        errorHoraText: 'Campo obrigatório',
        errorAffinity: false,
        affinityTo: '',
        customAffinity: []
      }
    },
    mounted(){
      this.groupsOfTabulation = this.groupTabulations.sort((a,b) => {
        return b.ordem < a.ordem;
      });
    },
    computed: Object.assign({},
      mapGetters('lib/', ['getContact', 'getTabulationNote', 'getEmailId']),
      {
        groupTabulations(){
          return this.getContact ? this.getContact.qualifications : [];
        },
        tabulations(){
          if(this.groupSelected){
            this.group = this.groupSelected.nome;
            this.groupLabel = this.groupSelected.label;
            return this.groupSelected.tabulacoes.sort((a,b) => {
              return b.ordem < a.ordem;
            });
          }
          else{
            this.group = '';
            return [];
          }
        },
        getAffinity(){
          return this.$parent.$data.affinityList;
        }
      }
    ),
    watch:{
      getAffinity: 'updateCustomAffinity'
    },
    methods: Object.assign({},
      mapActions('lib/', ['get-affinitylist', 'set-tabulation']),
      {
        getColClass(size){
          if(size){
            return `col-lg-${size}`;
          }
          return `col-lg-${parseInt(12/this.columns)}`;
        },
        updateCustomAffinity(arr){
          this.customAffinity = arr;
          this.treatAffinity();
        },
        updateTab(){
          if(this.tabulation){
            this.$store.commit('SET_TABULATIONNAME', this.tabulation.nome);
            if(name){
              this.treatAffinity();
            }
          }
        },
        treatAffinity(){
          let tab = this.tabulation;
          if(tab && tab.acao && tab.acao.affinity_with){
            if(this.affinityCustom){
              this.affinities = this.customAffinity;
            }
            else{
              let url = 'affinity?affinity_with=' + tab.acao.affinity_with;
              if(this.affinityList[tab.acao.affinity_with]){
                this.affinities = this.affinityList[tab.acao.affinity_with];
              }
              else{
                let me = this;
                this['get-affinitylist'](url).then(response =>{
                  if(tab.acao.affinity_with == 'USUARIO'){
                    response.body.forEach(item =>{
                      item.label = item.nome_completo;
                    });
                  }
                  me.affinityList[tab.acao.affinity_with] = response.body;
                  me.affinities = me.affinityList[tab.acao.affinity_with];
                });
              }
            }
          }
        },
        resetValues(){
          this.tabulated = false;
          this.group = "";
          this.groupLabel = "";
          this.tabulation = "";
          this.dataAgendamento = null;
          this.horaAgendamento = null;
          this.telAgendamento = null;
        },
        formatTabulation(){
          let note = this.showNote ? this.note : this.getTabulationNote;
          let objBase = {
            tabulacao: this.tabulation.nome,
            info_tab: {
              type: this.tabulation.acao.tipo,
              label: this.tabulation.label,
              group: this.group,
              group_label: this.groupLabel
            },
            note: note,
            email_id: this.getEmailId,
            agendamento: {
              data: this.dataAgendamento,
              hora: this.horaAgendamento,
              destino: this.telAgendamento
            }
          };

          if(this.tabulation.acao.tipo == 'AGENDADOR' || this.tabulation.acao.tipo == 'AFFINITY'){
            let agendamento = {
              enderecamento: this.telAgendamento,
              data_hora: {
                $date: this.dataAgendamento+'T'+this.horaAgendamento+":00.000"
              }
            };

            if(this.tabulation && this.tabulation.acao && this.tabulation.acao.tipo == 'AFFINITY' && this.tabulation.acao.usuario_seleciona_destino){
              agendamento.affinity_to = {};
              agendamento.affinity_to[this.tabulation.acao.affinity_with] = this.affinityTo;
            }

            objBase.agendamento = agendamento;
          }
          else if(this.tabulation.acao.tipo == 'FINALIZADOR'){
            objBase.info_tab.indica_sucesso_negocio = this.tabulation.acao.indica_sucesso_negocio;
          }

          if(this.order && this.order.items && this.order.items.length > 0){
            objBase.order = this.order;
          }

          return objBase;
        },
        tabulationIsValid(){
          if(this.tabulation){
            this.errorsTab = [];
            if(this.tabulation.acao.tipo === 'AGENDADOR' || this.tabulation.acao.tipo === 'AFFINITY'){
              if(this.tabulation.acao.tipo === 'AFFINITY' && this.tabulation.acao.usuario_seleciona_destino){
                if(!this.affinityTo){
                  this.errorAffinity = true;
                  this.errorsTab.push('Campo obrigatório.');
                }
                else{
                  this.errorAffinity = false;
                }
              }
              else{
                this.errorAffinity = false;
              }
              if(this.dataAgendamento && this.horaAgendamento){
                this.errorData = false;
                this.errorHora = false;
                let dateNow = (new Date()).getTime();
                let dateAgend = (new Date(this.dataAgendamento + 'T' + this.horaAgendamento)).getTime();
                if(dateNow > dateAgend){
                  this.errorData = true;
                  this.errorHora = true;
                  this.errorsTab.push('Data não permitida.');
                  this.errorDataText = 'Data/hora deve ser maior que atual';
                  this.errorHoraText = '';
                }
              }
              else{
                this.errorData = false;
                this.errorHora = false;
                if(!this.dataAgendamento){
                  this.errorData = true;
                  this.errorsTab.push('Data não informada.');
                  this.errorDataText = 'Campo obrigatório';
                }
                if(!this.horaAgendamento){
                  this.errorHora = true;
                  this.errorsTab.push('Hora não informada.');
                  this.errorHoraText = 'Campo obrigatório';
                }
              }
            }
          }
          else{
            this.errorTabulacao = true;
          }
          return this.errorsTab.length > 0 ? false : true;
        },
        sendTab(objTabulation){
          this.$store.commit('SET_TABULATION', objTabulation);
          this['set-tabulation'](false).then(ret => {
            if(ret.ok){
              CsEvents.$emit('TabulationSuccess', ret);
              this.resetValues();
            }
          });
        },
        tabulate(){
          if(this.tabulationIsValid()){
            let objTabulation = this.formatTabulation();
            if(this.beforeTabulate){
              let me = this;
              this.beforeTabulate({formated: objTabulation, original: this.tabulation}).then(() => {
                me.sendTab(objTabulation);
              })
            }
            else{
              this.sendTab(objTabulation);
            }
          }
        }
      }
    )
  }
</script>

<style lang="scss">
  .cs-textarea{
    resize: none;
  }
</style>