<template>
  <div class="container">
    <div class="content is-small">
      <h1>Manage</h1>
      <p>
        <b-button :loading="loading" @click="listDevices">Load device list</b-button>
      </p>
      <p>
        <b-table :data="devices" :columns="deviceProps" />
      </p>
      <h2>Add device</h2>
      <p>
        <b-field>
          <b-checkbox v-model="addOpt.rpc">Allow RPC Call</b-checkbox>
        </b-field>
        <b-field>
          <b-checkbox v-model="addOpt.admin">Allow Admin Call</b-checkbox>
        </b-field>
        <b-field position="is-centered">
          <div class="control">
            <b-button type="is-primary" :loading="loading" @click="addSubmit">Submit</b-button>
          </div>
        </b-field>
      </p>
    </div>
  </div>
</template>

<script>
import { invoke } from '@/io'

export default {
  name: 'Manage',
  data: () => ({
    devices: [],
    deviceProps: [
      { field: 'id', label: 'ID' },
      { field: 'rpc', label: 'RPC' },
      { field: 'admin', label: 'Admin' }
    ],
    loading: false,
    addOpt: {
      rpc: false,
      admin: false
    }
  }),
  methods: {
    async listDevices () {
      try {
        this.loading = true
        this.devices = await invoke('list_devices', {}, {})
      } catch (e) {
        //
      } finally {
        this.loading = false
      }
    },
    async addSubmit () {
      try {
        this.loading = true
        const id = await invoke('add_device', [this.addOpt.admin, this.addOpt.rpc], {})
        this.$buefy.toast.open({
          duration: 1000,
          message: 'OK: ' + id,
          position: 'is-bottom',
          type: 'is-success'
        })
        await this.listDevices()
      } catch (e) {
        //
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
