<template>
    <section>
        <div style="width: 80%; margin: 0 auto; padding-top: -5%; position: relative;">
            <div style = "display:inline-block; margin-right: 18%;">
                <img src = "../../../assets/noPermissions.png" style="margin-top: 60px;"/>
            </div>
            <div style = "position: absolute; top: 20px; right: 10%;">
                <h1 style = "font-size:72px; margin-top: 80px; padding-top: -20px;">403</h1>
                <p style="margin-top: -30px;">抱歉，您没有相关权限</p>
                <el-button type="primary" style = "padding: 10px 15px; margin-top: 5px;"
                           @click="$router.push({ path: '/dashboard'})">返回首页</el-button>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'noPermissions',
}
</script>
