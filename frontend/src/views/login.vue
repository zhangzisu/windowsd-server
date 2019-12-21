<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-half">
        <div class="notification">
          <div class="content">
            <h1>Sign In</h1>
            <b-field label="Username">
              <b-input v-model="username" />
            </b-field>
            <b-field label="Password">
              <b-input v-model="password" type="password" />
            </b-field>
            <b-field position="is-centered">
              <div class="control">
                <b-button type="is-primary" :loading="loading" @click="submit">Submit</b-button>
              </div>
            </b-field>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { JSONPost } from '@/utils'
import { connect } from '@/io'

export default {
  name: 'Login',
  data: () => ({
    username: '',
    password: '',
    loading: false
  }),
  methods: {
    async submit () {
      try {
        this.loading = true
        const { id } = await JSONPost('/api/finduser', { name: this.username })
        await connect(id, this.password)
        this.$buefy.toast.open({
          duration: 5000,
          message: 'OK',
          position: 'is-bottom',
          type: 'is-success'
        })
        this.$router.push('/manage')
      } catch (e) {
        console.log(e)
        this.$buefy.toast.open({
          duration: 5000,
          message: e.message || e,
          position: 'is-bottom',
          type: 'is-danger'
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
