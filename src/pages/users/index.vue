<template>
    <layouts-main>
        <span slot="title">Users</span>

        <div class="page-users">

            <div class="page-users__filter">
                <md-field>
                    <label>Search</label>
                    <md-input @input="onSearchDebounce" v-model="search"></md-input>
                    <span v-if="searchPending"><md-progress-spinner class="page-users__filter-progress" :md-diameter="20" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner></span>
                </md-field>
            </div>

            <div class="page-users__list" ref="list" :class="{'is-empty': !list.length && !loadPending}">
                <md-list class="md-triple-line">
                    <div v-for="item in list" :key="item.id">
                        <md-list-item>
                            <md-avatar>
                                <img :src="item.avatarUrl" alt="People">
                            </md-avatar>

                            <div class="md-list-item-text">
                                <span>{{item.name}}</span>
                            </div>
                        </md-list-item>

                        <md-divider class="md-inset"></md-divider>
                    </div>
                </md-list>

                <infinite-loading @infinite="infiniteHandler" :distance="200" v-if="!disabledAutoLoad"><span slot="spinner"></span></infinite-loading>
                <div v-if="loadPending" class="page-users__load-progress"><md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner></div>
                <md-button v-if="!isFull && !loadPending" @click="moreClick" class="page-users__more md-raised md-primary">Load more</md-button>
            </div>

        </div>
    </layouts-main>
</template>

<script>
    import infiniteLoading from 'vue-infinite-loading'
    import layoutsMain from '@/layouts/main'
    import {debounce} from 'lodash'

    export default {
        name: 'page-users',
        components: {
            layoutsMain,
            infiniteLoading
        },
        data () {
            return {
                // Счетчик аотоматической загрузки
                counterAutoLoad: 0,
                // Значение поля поиска
                search: '',
                // Состояние обработки поиска
                searchPending: false,
                // Состояние обработки загрузки
                loadPending: true
            }
        },
        methods: {
            /**
             * Обработчик поиска с задержкой
             */
            onSearchDebounce: () => {},

            /**
             * Обработчик поиска
             * @returns {Promise}
             */
            onSearch () {
                this.searchPending = true
                return this.$store.dispatch('users/changeQuery', {key: 'searchTerm', value: this.search})
                    .then(() => {
                        this.$refs.list.scrollTop = 0
                        this.refreshCounterAutoLoad()
                        this.searchPending = false
                    })
                    .catch(() => (this.searchPending = false))
            },

            /**
             * Загружает список пользователей
             * @returns {Promise}
             */
            more () {
                this.loadPending = true
                return this.$store.dispatch('users/fetchList')
                    .then(() => (this.loadPending = false))
                    .catch(() => (this.loadPending = false))
            },

            /**
             * Обработчик автоматической загрузки
             * @param $state
             * @returns {Promise}
             */
            infiniteHandler ($state) {
                this.counterAutoLoad++
                return this.more()
                    .then(() => $state.loaded())
                    .catch(() => $state.loaded())
            },

            /**
             * Обработчик ручной загрузки
             * @returns {Promise}
             */
            moreClick () {
                return this.more()
                    .then(() => this.refreshCounterAutoLoad())
            },

            /**
             * Сбасывает счетчиа автоматической загрузки
             */
            refreshCounterAutoLoad () {
                this.counterAutoLoad = 0
            }
        },
        computed: {
            /**
             * Список пользователей
             * @returns {Array}
             */
            list () {
                return this.$store.getters['users/list']
            },

            /**
             * Состояние заполненности списка
             * @returns {Boolean}
             */
            isFull () {
                return this.$store.getters['users/isFull']
            },

            /**
             * Состояние блокировки автозагрузки
             * @returns {Boolean}
             */
            disabledAutoLoad () {
                return this.counterAutoLoad >= 3
            }
        },

        mounted () {
            // Создаем обработчик с задержкой в 600ms
            this.onSearchDebounce = debounce(() => this.onSearch(), 600)
        },

        destroy () {
            this.$store.dispatch('users/reset')
        }
    }
</script>

<style rel="stylesheet/stylus" lang="stylus">
.page-users {
    display flex
    flex 1 1
    flex-direction column

    &__list {
        min-height 250px
        overflow auto
        -webkit-overflow-scrolling touch
        flex 1 1

        &.is-empty {
            background-image url('../../assets/empty.png')
            background-size 200px
            background-repeat no-repeat
            background-position 50% 50%
        }
    }

    &__filter {
        &-progress {
            width 20px
            height @width
        }
    }

    &__more {
        width 100%
        margin 25px 0 0 0
    }

    &__load-progress {
        text-align center
        margin 25px auto 0 auto
    }
}
</style>
