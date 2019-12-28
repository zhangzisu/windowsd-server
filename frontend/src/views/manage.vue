<template>
  <div class="container">
    <div class="content is-small">
      <h1>Manage</h1>
      <p>
        <b-button :loading="loading" @click="listDevices">Load device list</b-button>
      </p>
      <p>
        <b-table :data="devices" :bordered="true">
          <template slot-scope="props">
            <b-table-column field="id" label="ID">
              {{ props.row.id }}
            </b-table-column>
            <b-table-column field="rpc" label="Allow RPC">
              {{ props.row.rpc }}
            </b-table-column>
            <b-table-column field="admin" label="Allow Admin">
              {{ props.row.admin }}
            </b-table-column>
            <b-table-column label="Actions" centered>
              <b-button size="is-small" type="is-danger" @click="remove(props.row.id)">Remove</b-button>
              <b-button size="is-small" type="is-warning" @click="revoke(props.row.id)">Revoke</b-button>
            </b-table-column>
          </template>
        </b-table>
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
    loading: false,
    addOpt: {
      rpc: false,
      admin: false
    }
  }),
  mounted () {
    this.listDevices()
  },
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
    },
    async remove (device) {
      try {
        this.loading = true
        await invoke('remove_device', [device], {})
        this.$buefy.toast.open({
          duration: 1000,
          message: 'OK',
          position: 'is-bottom',
          type: 'is-success'
        })
        await this.listDevices()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async revoke (device) {
      try {
        this.loading = true
        await invoke('revoke_device', [device], {})
        this.$buefy.toast.open({
          duration: 1000,
          message: 'OK',
          position: 'is-bottom',
          type: 'is-success'
        })
        await this.listDevices()
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
