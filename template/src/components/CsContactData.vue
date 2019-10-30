<template>
  <div>
    <CsForm :form="items" :form-data="getContact.data" :columns="2" />
    <div class="text-center">
      <div class="btn btn-primary" @click="updateDataContact">Atualizar Dados</div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { CsForm, CsEvents } from '@contactstudio/agent-tools';

  export default {
    components: {
      CsForm,
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
      {}
    ),
    methods: Object.assign({},
      mapActions('lib/', ['update-contact']),
      {
        updateDataContact(){
          this['update-contact'](this.getContact.data).then(ret => {
            console.log(ret);
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