<template>
  <div>
    <CsForm :form="items" :form-data="getContact.data" :columns="2" />
    <div class="row">
      <div class="col-sm-4">
        <CsInputCEP :field="fieldCep" :searchable="false" @AddressFounded="populateCEP" @AddressSelected="populateCEP" />
      </div>
    </div>
    <div class="text-center">
      <div class="btn btn-primary" @click="updateDataContact">Atualizar Dados</div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { CsForm, CsInputCEP, CsEvents } from '@contactstudio/agent-tools';

  export default {
    components: {
      CsForm,
      CsInputCEP
    },
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    data(){
      return {
        saved: false
      }
    },
    computed: Object.assign({},
      mapGetters('lib/', ['getContact']),
      {
        fieldCep(){
          return {
            label: 'CEP',
            valid: true,
            value: this.getContact.data.CEP,
            options: {placeholder: '00000-000'}
          }
        }
      }
    ),
    methods: Object.assign({},
      mapActions('lib/', ['update-contact']),
      {
        populateCEP(data){
          this.getContact.data['ESTADO'] = data.uf;
          this.getContact.data['CIDADE'] = data.localidade;
          this.getContact.data['BAIRRO'] = data.bairro;
          this.getContact.data['CEP'] = data.cep;
          this.updateDataContact();
        },
        updateDataContact(){
          this['update-contact'](this.getContact.data).then(ret => {
            CsEvents.$emit('showAlert', {
              success: ret.ok,
              text: ret.ok ? "Informações atualizadas!" : `Falha ao atualizar informações: ${ret.data.message}`,
              time: ret.ok ? 2000 : 5000
            })
            if(ret.ok){
              this.$emit('UpdatedContact')
            }
          })
        }
      }
    )
  }
</script>
