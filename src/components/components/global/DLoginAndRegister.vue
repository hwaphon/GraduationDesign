<template>
  <el-dialog
    :visible.sync="show"
    @close="closeDialog"
    :close-on-click-modal="false"
    width="30%">
    <div>
      <el-tabs v-model="active">
        <el-tab-pane label="登录" name="login">
          <div class="form-container">
            <el-form ref="login-form" :model="form" label-width="0px" v-if="show" :status-icon="true" :rules="rules">
              <el-form-item
                prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名">
                </el-input>
              </el-form-item>
              <el-form-item prop="pass" class="pass-container">
                <el-input
                  type="password" v-model="form.pass" placeholder="请输入登录密码"
                  auto-complete="off"></el-input>
                <span class="forget-pass" @click="openEmailInput">忘记密码？</span>
              </el-form-item>
              <el-form-item>
                <button @click.prevent="submitForm('login-form')" class="login-button">登录</button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
          <div class="form-container">
            <el-form ref="register-form" :model="form" label-width="0px" v-if="show" :status-icon="true" :rules="rules">
              <el-form-item
                prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名">
                </el-input>
              </el-form-item>
              <el-form-item prop="pass">
                <el-input
                  type="password" v-model="form.pass" placeholder="请输入密码"
                  auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item prop="confirmPass">
                <el-input
                  type="password" v-model="form.confirmPass" placeholder="请确认密码"
                  auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <button @click.prevent="submitForm('register-form')" class="register-button">注册</button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        :visible.sync="emailVerify"
        width="20%"
        append-to-body>
        <el-input v-model="bemail"
                  placeholder="请输入你的邮箱"
                  prefix-icon="el-icon-message"></el-input>
        <span slot="footer" class="dialog-footer">
        <el-button @click="emailVerify = false">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确定</el-button>
      </span>
      </el-dialog>
    </div>
  </el-dialog>
</template>

<script>
  import API from '@/const/dataApi'
  import Request from '@/network/networkHelper'
  import Event from '@/const/Event'
  import Tooltip from '@/util/tooltip'
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      activeName: {
        type: String,
        default: 'login'
      }
    },
    data() {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback()
        }
      };
      var validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          callback()
        }
      };
      var validateConfirmPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请确认密码'))
        } else if (value !== this.form.pass) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      };
      return {
        show: this.value,
        active: this.activeName,
        emailVerify: false,
        bemail: '',
        tooltip: new Tooltip(this),
        form: {
          username: '',
          pass: '',
          confirmPass: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ],
          confirmPass: [
            { validator: validateConfirmPass, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      closeDialog() {
        this.show = false
        this.$emit('input', this.show)
      },
      openEmailInput () {
        this.emailVerify = true
      },
      verifyEmail (email) {
        let emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/g
        return emailReg.test(email)
      },
      resetPassword () {
        let _this = this
        if (this.verifyEmail(this.bemail)) {
          Request.post(API.RESETPASSWORD, { email: this.bemail})
            .then(function (res) {
              if (res.status === 200 || res.status === 201) {
                _this.tooltip.show('success', '重置密码邮件已发送，请注意查收')
                _this.emailVerify = false
              } else {
                _this.tooltip.show('warning', '重置密码失败，请稍后重试')
              }
            })
        } else {
          this.tooltip.show('warning', '请输入合法的邮箱地址')
        }
      },
      showMessage (type, message) {
        this.$message({
          type,
          message,
          center: true,
          duration: 2000
        })
      },
      submitForm(formName) {
        var _this = this
        this.$refs[formName].validate((valid) => {
          if (valid && formName === 'login-form') {
            Request.login(API.LOGIN,
              { username: this.form.username,
                password: this.form.pass })
              .then(function (res) {
                if (res.status === 200) {
                  _this.closeDialog()
                  _this.$emit(Event.LoginSuccess, { avatar: res.data.avatar, username: res.data.username })
                  _this.showMessage('success', '登录成功')
                  window.location.reload()
                }
              }).catch(function (err) {
                _this.showMessage('warning', '登陆失败，请检查用户名和密码是否正确')
            })
          } else if (valid && formName === 'register-form') {
            Request.register(API.REGISTER, {
              username: this.form.username,
              password: this.form.pass
            }).then(function (res) {
              if (res.status === 201) {
                _this.closeDialog()
                _this.$emit(Event.LoginSuccess, { avatar: res.data.avatar,
                  username: res.data.username, isTeacher: res.data.isTeacher })
                _this.showMessage('success', '注册成功')
              }
            })
          } else {
            _this.showMessage('warning', '请检查表单是否填写正确')
            return false;
          }
        });
      }
    },
    watch: {
      value(newValue) {
        this.show = newValue
      },
      activeName (newValue) {
        this.active = newValue
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../../styles/global/dloginandregister";
</style>
