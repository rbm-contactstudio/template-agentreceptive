<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <span class="title-contact">{{ getContactName }}</span>
      <span class="box-facilities">
        <CsFacilities :facs="facilities"/>
      </span>
    </div>
    <div class="panel-body">
      <CsContactData :items="formContact" @UpdatedContact="updatedContact = true" />
      <CsCardSale />
      <CsManifestation manifest-name="ARVORE_UNO" :columns="3" />
      <CsClassification :contact="getContact" />
      <CsEmail :email-id="getContact.email_id" />
      <CsTabulation  />
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import {
    CsFacilities, CsCardSale, CsManifestation, CsClassification, CsEmail
  } from '@contactstudio/agent-tools';
  import CsContactData from './CsContactData.vue';
  import CsTabulation from './CsTabulation.vue';

  export default {
    components: {
      CsFacilities,
      CsContactData,
      CsCardSale,
      CsEmail,
      CsManifestation,
      CsClassification,
      CsTabulation
    },
    data(){
      return{
        formContact: [
          {label: 'Nome', typeField: 'TEXTO', model: 'NOME', valid: true, required: true, options: {placeholder: ''}, errorField: 'Nome inválido.', classe: 'form-group'},
          {label: 'Telefone', typeField: 'TEXTO', model: 'TELEFONE', valid: true, required: false, options: {placeholder: ''}, errorField: 'Telefone inválido.', classe: 'form-group'},
          {label: 'Email', typeField: 'TEXTO', model: 'EMAIL', valid: true, required: false, options: {placeholder: '', size: 4}, errorField: 'Telefone inválido.', classe: 'form-group'},
          {label: 'CPF', typeField: 'TEXTO', model: 'CPF', valid: true, required: false, options: {placeholder: '', size: 4}, errorField: 'Telefone inválido.', classe: 'form-group'},
          {label: 'UF', typeField: 'TEXTO', model: 'ESTADO', valid: true, required: false, options: {placeholder: '', size: 4}, errorField: 'Telefone inválido.', classe: 'form-group'}
        ],
        updatedContact: false,
      }
    },
    computed: Object.assign({},
      mapGetters('lib/', ['getContact', 'getFieldName']),
      {
        getContactName(){
          return this.getFieldName ? this.getContact.data[this.getFieldName.nome] : '';
        },
        facilities(){
          return this.getContact.facilities;
        }
      }
    )
  }
</script>

<style lang="scss">
  .title-contact{
    font-size: 20px;
  }
  .box-facilities{
    display: inline-block;
    float: right;
    margin-top: -3px;
  }
</style>