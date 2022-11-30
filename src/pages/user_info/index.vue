<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="头像" :inline="true">
        <div style="margin-bottom: 1px">
          <el-upload
            action
            ref="upload"
            :http-request="uploadImage"
            :show-file-list="false"
            name="image"
            accept="image/jpeg,image/jpg,image/png"
            list-type="picture-card"
            :limit="1"
            :before-upload="beforeUpload"
          >
            <el-image
              style="width: 145px; height: 145px"
              :src="form.avatar"
              alt
            />
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/jpeg/png文件，且不超过1MB
            </div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="用户ID">
        <el-input
          v-model="form.id"
          :disabled="true"
          class="input-wrapper"
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input
          v-model="form.email"
          class="input-wrapper"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="重置密码">
        <el-button type="danger" @click="openResetPassDlg">修改密码</el-button>
      </el-form-item>
      <el-form-item label="入站时间">
        <el-input
          v-model="form.created_at"
          class="input-wrapper"
          :disabled="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickname" class="input-wrapper"></el-input>
      </el-form-item>
      <!-- <el-form-item label="毕业学校">
        <el-select v-model="form.school" class="input-wrapper">
          <el-option label="南京航空航天大学" value="nuaa"></el-option>
          <el-option label="南京理工大学" value="nust"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="在校时间">
        <div>
          <el-date-picker
            v-model="form.startDate"
            type="datetime"
            placeholder="入学日期"
            class="input-wrapper"
          />
          <span style="margin: 0 10px;color: #DCDFE6">-</span>
          <el-date-picker
            v-model="form.startDate"
            type="datetime"
            placeholder="离校日期"
            class="input-wrapper"
          />
        </div>
      </el-form-item>
      <el-form-item label="所学专业">
        <el-cascader :options="options" class="input-wrapper">
          <template slot-scope="{ node, data }">
            <span>{{ data.label }}</span>
            <span v-if="!node.isLeaf">({{ data.children.length }})</span>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item label="必修专业">
        <el-radio-group v-model="form.resource">
          <el-radio label="数据结构"></el-radio>
          <el-radio label="算法"></el-radio>
          <el-radio label="计算机操作系统"></el-radio>
          <el-radio label="数据库系统"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选修课">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="计算机组装与维修" name="type"></el-checkbox>
          <el-checkbox label="企业网安全高级技术" name="type"></el-checkbox>
          <el-checkbox label="计算机网络技术" name="type"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="是否在校">
        <el-switch v-model="form.status"></el-switch>
      </el-form-item> -->
      <el-form-item label="签名">
        <el-input
          type="textarea"
          v-model="form.sign"
          rows="4"
          style="width: 600px"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">确定修改</el-button>
        <el-button @click="handleCancel">取消修改</el-button>
      </el-form-item>
    </el-form>
    <!-- 重置密码窗口 -->
    <el-dialog
      :visible.sync="isResetPassDlgVisiable"
      :modal-append-to-body="false"
      width="30%"
    >
      <div class="right-wrapper">
        <el-form ref="resetPassRef" :model="resetPassForm" :rules="rules">
          <div class="login-title">重置密码</div>
          <el-form-item style="margin-top: 20px" prop="password">
            <el-input
              show-password
              v-model="resetPassForm.password"
              size="large"
              style="width: 300px"
              type="password"
              placeholder="密码"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 20px" prop="repassword">
            <el-input
              show-password
              v-model="resetPassForm.repassword"
              size="large"
              style="width: 300px"
              type="password"
              placeholder="确认密码"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item style="margin-top: 30px">
            <el-button
              type="primary"
              style="width: 100%"
              size="large"
              @click="handleResetPass"
              >重置密码</el-button
            >
          </el-form-item>
          <el-form-item style="margin-top: 30px">
            <el-input
              v-model="resetPassForm.active_code"
              size="large"
              style="width: 200px"
              placeholder="验证码"
              prefix-icon="el-icon-lock"
            ></el-input>
            <el-button
              type="primary"
              style="width: 33%"
              size="large"
              @click="handleActiveResetPass"
              >验证</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateUser, findUser } from "../../api/user";
import { uploadImage } from "../../api/file";
import { resetPass, activeResetPass } from "../../api/login";
export default {
  name: "user_info",
  data() {
    // 邮箱校验
    var checkEmail = (rule, value, callback) => {
      const mal = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (rule.required && !value) {
        return callback(new Error("邮箱不能为空"));
      }
      if (value) {
        if (!mal.test(value)) {
          callback(new Error("请输入正确邮箱"));
        } else {
          callback();
        }
      }
    };
    var validateTwoPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (value !== this.resetPassForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      isResetPassDlgVisiable: false,
      form: {
        id: "",
        avatar: "",
        email: "",
        password: "",
        created_at: "",
        nickname: "",
        sign: "",
      },
      resetPassForm: {
        password: "",
        repassword: "",
        active_code: "",
      },
      rules: {
        email: [
          { required: true, validator: checkEmail, trigger: "blur" },
          { max: 50, message: "邮箱过长", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { max: 50, message: "密码过长", trigger: "blur" },
        ],
        repassword: [
          { required: true, validator: validateTwoPass, trigger: "blur" },
        ],
        nickname: [{ max: 20, message: "昵称过长", trigger: "blur" }],
        sign: [{ max: 50, message: "签名过长", trigger: "blur" }],
      },
      // options: [
      //   {
      //     value: "hk",
      //     label: "航空学院",
      //     children: [
      //       {
      //         value: "fxqsj",
      //         label: "飞行棋设计与工程",
      //       },
      //       {
      //         value: "fxqhj",
      //         label: "飞行器环境与生命保障工程",
      //       },
      //     ],
      //   },
      //   {
      //     value: "ny",
      //     label: "能源与动力学院",
      //     children: [
      //       {
      //         value: "fxqdl",
      //         label: "飞行器动力工程",
      //       },
      //       {
      //         value: "ny",
      //         label: "能源与动力工程",
      //       },
      //     ],
      //   },
      // ],
    };
  },
  created: function() {
    this.loadUserInfo();
  },
  methods: {
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (!valid) {
          return;
        } else {
          let params = {
            avatar: this.form.avatar,
            nickname: this.form.nickname,
            sign: this.form.sign,
          };
          console.log(params);
          updateUser(params).then((res) => {
            if (res.code === 200) {
              this.$message.success("修改成功!");
              this.loadUserInfo();
            } else {
              this.$message.error(res.msg);
            }
          });
        }
      });
    },
    handleCancel() {
      this.loadUserInfo();
    },
    loadUserInfo() {
      findUser().then((res) => {
        if (res.code === 200) {
          this.form = res.data.user;
          return;
        } else {
          this.$message.error(res.msg);
          return;
        }
      });
    },
    uploadImage(params) {
      let file = params.file;
      let headers = {
        "Content-Type": file.type,
      };
      const formData = new FormData();
      formData.append("image", file);
      uploadImage(formData, headers).then((res) => {
        if (res.code === 200) {
          this.$message.success("上传成功!");
          this.form.avatar = res.data.image_url;
        } else {
          this.$message.error(res.msg);
        }
        this.$refs.upload.clearFiles();
      });
    },
    beforeUpload(file) {
      const isCorrectFormat =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isCorrectFormat) {
        this.$message.error("图片格式错误");
      }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过1MB");
      }
      return isCorrectFormat && isLt2M;
    },
    openResetPassDlg() {
      this.isResetPassDlgVisiable = true;
    },
    handleResetPass() {
      this.$refs["resetPassRef"].validate((valid) => {
        if (!valid) {
          return;
        } else {
          let params = {
            email: this.form.email,
          };
          resetPass(params).then((res) => {
            if (res.code === 200) {
              this.$message.success(
                "注册成功，验证码已发到您的邮箱，请在5分钟内输入验证码激活账号"
              );
              return;
            } else {
              this.$message.error(res.msg);
              return;
            }
          });
        }
      });
    },
    handleActiveResetPass() {
      let params = {
        email: this.form.email,
        active_code: this.resetPassForm.active_code,
        password: this.resetPassForm.password,
      };
      activeResetPass(params).then((res) => {
        if (res.code === 200) {
          this.$message.success("验证成功！");
          this.isResetPassDlgVisiable = false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
  },
};
</script>

<style scoped>
.right-wrapper {
  flex: 1;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

.login-title {
  width: 300px;
  text-align: center;
  font-size: 30px;
  margin-bottom: 40px;
}
</style>
