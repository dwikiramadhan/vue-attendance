<template>
  <el-card class="card-round">
    <!-- <count-to class="number" :start-val="0" :end-val="number" :duration="1000" /> -->
    <div class="heading">
      Sudahkah anda, <br /><span class="red">Presensi</span> hari ini!
    </div>
    <div class="label">Budayakan disiplin absensi dari sekarang!</div>
    <div style="margin-top: 20px">
      <el-button
        type="primary"
        round
        icon="el-icon-plus"
        @click="toggleCamera"
        >Absen Sekarang</el-button
      >
      <!-- <video ref="videoElement" autoplay></video> -->
    </div>
    <!-- DIALOG ADD DEVICE -->
    <el-dialog
      :visible.sync="dialogAddPhoto"
      :close-on-click-modal="false"
      class="dialog-small"
      :before-close="handleClose"
    >
  
      <div
        v-if="isCameraOpen"
        v-show="!isLoading"
        class="camera-box"
        :class="{ flash: isShotPhoto }"
      >
        <div class="camera-shutter" :class="{ flash: isShotPhoto }"></div>

        <video
          v-show="!isPhotoTaken"
          ref="camera"
          width="100%"
          autoplay
        ></video>

        <div class="label">
          Latitude: <b>{{ inputForm.latitude }}</b><br>
          Longitude: <b>{{ inputForm.longitude }}</b>
        </div>

        <canvas
          v-show="isPhotoTaken"
          id="photoTaken"
          ref="canvas"
          :width="450"
          :height="337.5"
          style="width: 100%;"
        ></canvas>
      </div>
      

      <!-- <div v-if="isCameraOpen && !isLoading" class="camera-shoot">
        <button type="button" class="button" @click="takePhoto">
          <img
            src="https://img.icons8.com/material-outlined/50/000000/camera--v2.png"
          />
        </button>
      </div> -->

      <div slot="footer" class="dialog-footer">
        <el-button v-if="isCameraOpen && !isLoading" class="button-custom large primary" icon="el-icon-camera" @click="takePhoto">Take Photo</el-button>
        <!-- <el-button
          class="button-custom small info"
          @click="toggleCamera(false)"
          >Cancel</el-button
        > -->
      </div>
  
    </el-dialog>
  </el-card>
</template>

<script>
import CountTo from "vue-count-to";
import { postAttendance, todayAttendance } from '@/api/attendance'
import { MessageBox } from "element-ui";

export default {
  components: { CountTo },
  props: {
    label: {
      type: String,
    },
    emp_no: {
      type: String,
    },
  },

  // mounted() {
  //   this.videoElement = this.$refs.videoElement;
  // },

  data() {
    return {
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
    };
  },

  methods: {
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
          this.$router.go('/dashboard')
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
.button-custom{
  margin-top: 0;
}
.dialog-footer {
  text-align: center;
}
.card-round {
  background-image: url("../../../assets/absen_ilustrasi.svg");
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
}
.label {
  font-size: 14px;
  line-height: 22px;
  margin-top: 10px;
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
