<template>
  <el-card class="card-round">
    <div class="card-title-number">{{totalSatpas | numberFormat}} Satpas</div>
    <div class="card-subtitle">Most Active Satpas</div>
    <div class="card-info" v-for="item,index in activeSatpasList" :key="index">{{item}}</div>
  </el-card>
</template>

<script>
export default {
  filters:{
    numberFormat: function(number){
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  data(){
    return{
      totalSatpas:0,
      activeSatpasList:[],
    }
  },
  created(){
    this.totalSatpas=1029
    this.activeSatpasList = [
      'Satpas Jakarta Selatan',
      'Satpas Polda Metro Jaya',
      'Satpas Jakarta Pusat',
      'Satpas Polres Metro Tangerang Kota',
      'Satpas Polres Tangerang Selatan'
    ]
  },
}
</script>

<style lang="scss" scoped>
.card-title{
  font-size: 44px;
  color: #D5E1E7;
  font-weight: 700;
  font-family: 'Roboto',sans-serif;
  text-align: center;
  margin-bottom: 15px;

  &-number{
    @extend .card-title;
    text-align: left;
    color: #85D3FF;
  }
}

.card-subtitle{
  color: #D5E1E7;
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 14px;
}

.card-info{
  margin-bottom: 10px;
  font-size: 14px;
}
</style>