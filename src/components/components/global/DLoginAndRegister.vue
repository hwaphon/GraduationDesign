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
            <el-form ref="form" :model="form" label-width="0px" v-if="show" :status-icon="true" :rules="rules">
              <el-form-item
                prop="username">
                <el-input v-model="form.username" placeholder="请输入登录邮箱">
                </el-input>
              </el-form-item>
              <el-form-item prop="pass">
                <el-input
                  type="password" v-model="form.pass" placeholder="请输入登录密码"
                  auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <button @click="submitForm('form')" class="login-button">登录</button>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">注册</el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>
  import API from '@/const/Api'
  import { request } from '@/network/network'
  import Event from '@/const/Event'
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
      return {
        show: this.value,
        active: this.activeName,
        form: {
          username: '',
          pass: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      closeDialog() {
        this.show = false
        this.$emit('input', this.show)
      },
      submitForm(formName) {
        var _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            request(API.LOGIN, { username: this.form.username, password: this.form.pass }, function (result) {
              if (result.status === 200) {
                _this.closeDialog()
                _this.$emit(Event.LoginSuccess, result.data)
              }
            })
          } else {
            console.log('error submit!!');
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
