<template>
    <div class="addcontrol" @click.stop>
        <transition name="move">
            <div class="con-minus icon-remove_circle_outline" v-show="food.count > 0" @click="minusCount"></div>
        </transition>
        <div class="con-count" v-show="food.count > 0">{{food.count}}</div>
        <div class="con-add icon-add_circle" @click="addCount($event)"></div>
    </div>
</template>
<script>
    export default {
        props: {
            food: {
                type: Object,
                default: () => {
                    return {};
                }
            }
        },
        // 注意在 JavaScript 中对象和数组是引用类型，
        // 指向同一个内存空间，如果 prop 是一个对象或数组，
        // 在子组件内部改变它会影响父组件的状态。
        methods: {
            addCount(e) {
                if (!this.food.count) {
                    this.$set(this.food, 'count', 1);
                } else {
                    this.food.count++;
                }
                // 事件巴士方法
                this.$root.Bus.$emit('bus', e.target);
                // 自定义事件 + 父组件调用子组件方法(refs)
                // this.$emit('con-add', e.target);
                // 使用vuex最好 这里只用作学习

                // 这里当变化调用方法 像要简便 只好使用事件巴士
            },
            minusCount() {
                this.food.count--;
            }
        }
    };
</script>

<style lang="less">
    .addcontrol {
        font-size: 0;
        .con-minus {
            display: inline-block;
            padding: 6px;
            line-height: 24px;
            font-size: 24px;
            color: rgb(0, 160, 220);
            &.move-enter, &.move-leave-to {
                opacity: 0;
                transform: translate3d(36px, 0, 0) rotate(180deg);
                // 开启硬件加速 使动画更加流畅
            }
            &.move-enter-active, &.move-leave-active{
                transition: all .5s linear;
            }
        }
        .con-count {
            display: inline-block;
            vertical-align: top;
            width: 12px;
            padding-top: 6px;
            line-height: 24px;
            text-align: center;
            font-size: 10px;
            color: rgb(147, 153, 159);
        }
        .con-add {
            display: inline-block;
            padding: 6px;
            line-height: 24px;
            font-size: 24px;
            color: rgb(0, 160, 220);
        }
    }
</style>
