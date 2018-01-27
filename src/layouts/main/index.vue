<template>
    <div class="page-container">
        <md-app md-waterfall md-mode="fixed">
            <md-app-toolbar class="md-primary">
                <span class="md-title">
                    <slot name="title"></slot>
                </span>
            </md-app-toolbar>

            <md-app-drawer md-permanent="full">
                <md-toolbar class="md-transparent" md-elevation="0">Navigation</md-toolbar>
                <the-left-menu></the-left-menu>
            </md-app-drawer>

            <md-app-content>
                <slot></slot>
            </md-app-content>
        </md-app>
    </div>
</template>

<script>
    import theLeftMenu from '@/components/the-left-menu'

    export default {
        name: 'layouts-main',
        components: {
            theLeftMenu
        }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus">
    .md-app {
        height 100vh
        border 1px solid rgba(#000, .12)
    }

    .md-drawer {
        width 230px
        max-width calc(100vw - 125px)
    }

    .md-app-content {
        display flex
        flex-direction column
    }
</style>
