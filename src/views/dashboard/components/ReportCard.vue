<template>
  <el-card class="card-round">
    <el-row :gutter="40">
      <el-col :span="12">
        <div class="heading">
          <span class="info">{{ label }}</span>
        </div>
        <div class="heading" v-if="att_type == 'come_in'" style="margin-top: 10px;">
          <div class="label" v-if="att_type == 'come_in'">{{ attendanceToday.come_in }}</div>
          <div v-if="attendanceToday.is_discipline !== ''">
            <el-tag type="success" v-if="!attendanceToday.is_discipline">Discipline</el-tag>
            <el-tag type="danger" v-if="attendanceToday.is_discipline">Undiscipline</el-tag>
          </div>
        </div>
        <div class="heading" v-else style="margin-top: 10px;">
          <div class="label" v-if="att_type == 'come_out'">{{ attendanceToday.come_out }}</div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="avatar-container">
          <el-button type="text" @click="showSingle" v-if="attendanceToday.is_discipline !== ''"><img id="avatar" class="avatar-round" :src="attendanceToday.selfie" alt="Base64 Image"></el-button>
          
          <vue-easy-lightbox
            escDisabled
            moveDisabled
            :visible="visible"
            :imgs="attendanceToday.selfie"
            :index="index"
            @hide="handleHide"
          ></vue-easy-lightbox>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { postAttendance, todayAttendance } from '@/api/attendance'
import { MessageBox } from "element-ui";
import moment from 'moment'
import VueEasyLightbox from 'vue-easy-lightbox'

export default {
  components: { VueEasyLightbox },
  props: {
    label: {
      type: String,
    },
    emp_no: {
      type: String,
    },
    att_type: {
      type: String,
    },
  },

  // mounted() {
  //   this.videoElement = this.$refs.videoElement;
  // },

  data() {
    return {
      visible: false,
      index: 0,   // default: 0
      isCameraOpen: false,
      isPhotoTaken: false,
      isShotPhoto: false,
      isLoading: false,
      link: "#",
      dialogAddPhoto: false,
      latitude: 0,
      longitude: 0,
      inputForm: {
        emp_no: this.emp_no,
        latitude: "",
        longitude: "",
        selfie: "",
      },
      attendanceToday: {
        come_in: "",
        is_discipline: '',
        come_out: "",
        selfie: "",
      }
    };
  },

  created() {
    this.getTodayAttendance()
  },

  methods: {
    showSingle() {
      this.imgs = 'http://via.placeholder.com/350x150'
      // or
      this.imgs = { title: 'this is a placeholder', src: 'http://via.placeholder.com/350x150' }
      this.show()
    },
    show() {
      this.visible = true
    },
    handleHide() {
      this.visible = false
    },
    getTodayAttendance() {
      this.listLoading = true
      todayAttendance(this.emp_no).then(response => {
        let resp = response.data.data
        
        if (resp.come_in != '') {
          var currentDate = moment().format("YYYY-MM-DD");
          var currentDateTime = currentDate + " " + resp.admission_time_limit
  
          var come_in = moment(new Date(resp.come_in)).format("YYYY-MM-DD HH:mm")
          var isafter = moment(come_in).isAfter(currentDateTime);
  
          this.attendanceToday.come_in = moment(new Date(resp.come_in)).format('HH:mm')
          this.attendanceToday.is_discipline = isafter
          console.log("isafter: ", isafter);

          this.attendanceToday.selfie = `data:image/jpeg;base64, ${resp.selfie}`
        }else{
          this.attendanceToday.come_in = "Belum absen hari ini" 
        }

        if (resp.come_out != '') {
          this.attendanceToday.come_out = moment(new Date(resp.come_out)).format('HH:mm')
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.inputForm.latitude = position.coords.latitude.toString();
            this.inputForm.longitude = position.coords.longitude.toString();
            // this.getAddress();
          },
          (error) => {
            console.error('Error retrieving location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    },
    // getAddress() {
    //   const geocoder = new google.maps.Geocoder();
    //   const latlng = new google.maps.LatLng(this.latitude, this.longitude);
    //   geocoder.geocode({ location: latlng }, (results, status) => {
    //     if (status === 'OK' && results[0]) {
    //       this.address = results[0].formatted_address;
    //     } else {
    //       console.error('Geocode was not successful for the following reason:', status);
    //     }
    //   });
    // },
    handleClose(done) {
      this.isCameraOpen = false;
      this.isPhotoTaken = false;
      this.isShotPhoto = false;
      this.stopCameraStream();
      this.dialogAddPhoto = false
    },
    toggleCamera(status) {
      if (status) {
        this.getLocation()
        this.dialogAddPhoto = true
        this.isCameraOpen = true;
        this.createCameraElement();
      }else{
        this.isCameraOpen = false;
        this.isPhotoTaken = false;
        this.isShotPhoto = false;
        this.stopCameraStream();
        this.dialogAddPhoto = false
      }
    },

    createCameraElement() {
      this.isLoading = true;

      const constraints = (window.constraints = {
        audio: false,
        video: true,
      });

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.isLoading = false;
          this.$refs.camera.srcObject = stream;
        })
        .catch((error) => {
          this.isLoading = false;
          alert("May the browser didn't support or there is some errors.");
        });
    },

    stopCameraStream() {
      let tracks = this.$refs.camera.srcObject.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });
    },

    takePhoto() {
      if (!this.isPhotoTaken) {
        this.isShotPhoto = true;

        const FLASH_TIMEOUT = 50;

        setTimeout(() => {
          this.isShotPhoto = false;
        }, FLASH_TIMEOUT);
      }

      this.isPhotoTaken = !this.isPhotoTaken;

      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");
      context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);
      const base64File = canvas.toDataURL("image/png");
      const getBase64StringFromDataURL = (dataURL) => dataURL.replace('data:', '').replace(/^.+,/, '');
      const base64 = getBase64StringFromDataURL(base64File);

      const tempData = Object.assign({}, this.inputForm)
      tempData.selfie = base64

      MessageBox.confirm(
        `Are you sure you want to add absence ? Your action can not be undone.`,
        "Confirmation",
        {
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
          type: "warning",
        }
      ).then(() => {
        postAttendance(tempData).then((response) => {
          this.$notify({
            title: 'Success',
            message: 'Berhasil absen hari ini',
            type: 'success',
            duration: 3000
          })
          this.handleClose()
        }).catch((err) => {
          this.$notify({
            title: 'Error',
            message: 'Gagal absen..',
            type: 'error',
            duration: 3000
          })
        })
      })

    },

    downloadImage() {
      const download = document.getElementById("downloadPhoto");
      const canvas = document
        .getElementById("photoTaken")
        .toDataURL("image/jpeg")
        .replace("image/jpeg", "image/octet-stream");
      download.setAttribute("href", canvas);
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-container{
  display: flex;
  align-items: end;
  flex-direction: column;

  .avatar-round{
    object-fit: cover;
    width: 100px;
    height: 100px;
    border-radius: 10px;
  }
  .avatar-option{
    display: flex;
    justify-content: center;
    margin: 15px;
    
    .avatar-sample {
      object-fit: cover;
      width: 60px;
      height: 60px;
      margin: 0 7px;
      transition: 0.2s;

      &:hover{
        cursor: pointer;
        opacity: 0.7;
      }
    }

    .upload-button-round{
    @extend .avatar-sample;
      border-radius: 10px;
      background: #0089C4;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 30px;
    }
  }
  
}
.button-custom{
  margin-top: 0;
}
.dialog-footer {
  text-align: center;
}
.card-round {
  background-position: 100%;
  background-size: contain;
  background-repeat: no-repeat;
}

.el-card {
  background-color: white;
  color: black;
  border: none;
  margin-bottom: 20px;
  padding: 30px;
  text-align: left;
}

.number {
  display: block;
  font-family: "Roboto";
  font-weight: 700;
  font-size: 42px;
  line-height: 49px;
  color: #990002;
}

.heading {
  font-size: 18px;
  line-height: 22px;
  font-weight: bold;
  // color: #828487;
  & .red {
    color: #e83328;
  }

  & .info {
    color: #0E436B;;
  }
}
.label {
  font-size: 14px;
  line-height: 22px;
  margin-top: 5px;
  margin-bottom: 5px;
  // color: #828487;
}

.web-camera-container {
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;

  .camera-button {
    margin-bottom: 2rem;
  }

  .camera-box {
    .camera-shutter {
      opacity: 0;
      width: 450px;
      height: 337.5px;
      background-color: #fff;
      position: absolute;

      &.flash {
        opacity: 1;
      }
    }
  }

  .camera-shoot {
    margin: 1rem 0;

    button {
      height: 60px;
      width: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 100%;

      img {
        height: 35px;
        object-fit: cover;
      }
    }
  }

  .camera-loading {
    overflow: hidden;
    height: 100%;
    position: absolute;
    width: 100%;
    min-height: 150px;
    margin: 3rem 0 0 -1.2rem;

    ul {
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 999999;
      margin: 0;
    }

    .loader-circle {
      display: block;
      height: 14px;
      margin: 0 auto;
      top: 50%;
      left: 100%;
      transform: translateY(-50%);
      transform: translateX(-50%);
      position: absolute;
      width: 100%;
      padding: 0;

      li {
        display: block;
        float: left;
        width: 10px;
        height: 10px;
        line-height: 10px;
        padding: 0;
        position: relative;
        margin: 0 0 0 4px;
        background: #999;
        animation: preload 1s infinite;
        top: -50%;
        border-radius: 100%;

        &:nth-child(2) {
          animation-delay: 0.2s;
        }

        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }
  }

  @keyframes preload {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
