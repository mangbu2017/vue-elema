<template>
    <div class="shopping-wrapper">
        <div class="shopping">
            <div class="content">
                <div class="content-left">
                    <div class="logo-wrapper" @click="listShow">
                        <div class="logo" :class="{light: totalCount > 0}">
                            <i class="icon-shopping_cart" :class="{light: totalCount > 0}"></i>
                        </div>
                        <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
                    </div>
                    <div class="price" :class="{light: totalPrice > 0}">¥ {{totalPrice}}</div>
                    <div class="desc">另需配送费¥{{price}}元</div>
                </div>
                <div class="content-right" :class="this.totalPrice < this.minPrice ? 'not-enough' : 'enough'" @click="pay">
                    <div class="pay">{{payDesc}}</div>
                </div>
            </div>
            <div class="ball-container">
                <transition v-for="(item, index) in balls"  :key="index" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
                    <div class="ball" v-show="item.ifShow">
                        <div class="inner"></div>
                    </div>
                </transition>
            </div>
            <transition name="fold">
                <div class="shopping-list" v-show="foldShow">
                    <div class="list-header">
                        <h1 class="title">购物车</h1>
                        <span class="empty" @click="clear">清空</span>
                    </div>
                    <div class="list-content" ref="listWrapper">
                        <ul>
                            <li class="food" v-for="(item, index) in selectFoods" :key="index">
                                <span class="name">{{item.name}}</span>
                                <div class="price">
                                    <span>¥{{item.price * item.count}}</span>
                                </div>
                                <div class="control-wrapper">
                                    <addcontrol :food="item"></addcontrol>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </transition>
        </div>
        <transition name="fade">
            <div class="list-background" v-show="foldShow"></div>
        </transition>
    </div>
</template>
<script>
    import addcontrol from '@/components/addcontrol/addcontrol';
    import BScroll from 'better-scroll';

    export default {
        data() {
            return {
                balls: [{
                    ifShow: false
                }, {
                    ifShow: false
                }, {
                    ifShow: false
                }, {
                    ifShow: false
                }, {
                    ifShow: false
                }],
                // 已经下落的小球
                dropBalls: [],
                fold: true
            };
        },
        computed: {
            foldShow() {
                return !this.fold && this.totalCount;
            },
            totalPrice() {
                let total = 0;
                this.selectFoods.forEach((item) => {
                    total += item.price * item.count;
                });
                return total;
            },
            totalCount() {
                let count = 0;
                this.selectFoods.forEach((item) => {
                    count += item.count;
                });
                return count;
            },
            payDesc() {
                if (this.totalPrice === 0) {
                    return `¥${this.minPrice}元起送`;
                } else if (this.totalPrice < this.minPrice) {
                    return `还差${this.minPrice - this.totalPrice}元起送`;
                } else {
                    return '去结算';
                }
            }
        },
        props: {
            price: Number,
            minPrice: Number,
            selectFoods: {
                type: Array,
                default: () => {
                    return [{
                        count: 1,
                        price: 21
                    }];
                }
            }
        },
        methods: {
            pay() {
                if (this.totalPrice < this.minPrice) {
                    return;
                }
                console.log('尚未实现');
            },
            listShow() {
                if (!this.totalCount) {
                    this.fold = true;
                    return;
                }
                this.fold = !this.fold;
            },
            drop(el) {
                // 从未活动数组中取出一个小球放入活动数组
                for (let i = 0; i < this.balls.length; i++) {
                    let ball = this.balls[i];
                    if (!ball.ifShow) {
                        ball.ifShow = true;
                        ball.el = el;
                        this.dropBalls.push(ball);
                        return;
                    }
                }
            },
            beforeEnter(el) {
                let count = this.balls.length;
                while (count--) {
                    let ball = this.balls[count];
                    if (ball.ifShow) {
                        let rect = ball.el.getBoundingClientRect();

                        let x = rect.left - 24;
                        let y = -(window.innerHeight - rect.top - 46);

                        el.style.wekitTransform = `translate3d(${x}px, 0px, 0px)`;
                        el.style.transform = `translate3d(${x}px, 0px, 0px)`;

                        let inner = el.getElementsByClassName('inner')[0];
                        inner.style.webkitTransform = `translate3d(0px, ${y}px, 0px)`;
                        inner.style.transform = `translate3d(0px, ${y}px, 0px)`;
                    }
                }
            },
            enter(el, done) {
                let refresh = el.offsetHeight; // eslint-disable-line

                el.style.wekitTransform = 'translate3d(0, 0, 0)';
                el.style.transform = 'translate3d(0, 0, 0)';

                let inner = el.getElementsByClassName('inner')[0];

                inner.style.webkitTransform = `translate3d(0px, 0px, 0px)`;
                inner.style.transform = `translate3d(0px, 0px, 0px)`;

                done(); // 不使用done 同步调用立即完成
            },
            afterEnter(el) {
                let ball = this.dropBalls.shift();
                if (ball) {
                    ball.ifShow = false;
                }
            },
            clear() {
                this.selectFoods.forEach((item) => {
                    item.count = 0;
                });
            }
        },
        created() {
            this.$root.Bus.$on('bus', (el) => {
                this.drop(el);
            });

            this.$nextTick(() => {
                this.srcoll = new BScroll(this.$refs.listWrapper, {
                    click: true
                });
            });
        },
        components: {
            addcontrol
        }
        // ball的transition动画需要js计算位置
        // 所以不能使用单纯的css动画
    };
</script>
<style lang="less">
    @import '../../common/less/scale.less';

    .shopping-wrapper {
        .shopping {
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 50;
            height: 48px;
            width: 100%;
            // background-color: #141d27;
            .content {
                background-color: #141d27;
                display: flex;
                .content-left {
                    flex: 1;
                    font-size: 0;
                    .logo-wrapper {
                        width: 56px;
                        height: 56px;
                        box-sizing: border-box;
                        display: inline-block;
                        // vertical-align: top;
                        position: relative;
                        top: -10px;
                        padding: 6px;
                        margin: 0 12px;
                        border-radius: 50%;
                        background-color: #141d27;
                        .logo {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                            background-color: #2b343c;
                            text-align: center;
                            &.light {
                                background-color: rgb(0, 160, 220);
                            }
                            .icon-shopping_cart {
                                font-size: 24px;
                                color: #80858a;
                                line-height: 44px;
                                &.light {
                                    color: #fff;
                                }
                            }
                        }
                        .num {
                            position: absolute;
                            top: 0;
                            right: 0;
                            width: 24px;
                            height: 16px;
                            line-height: 16px;
                            text-align: center;
                            border-radius: 16px;
                            font-size: 9px;
                            font-weight: 700;
                            color: #fff;
                            background-color: rgb(240, 20, 20);
                            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .4);
                        }
                    }
                    .price {
                        display: inline-block;
                        vertical-align: top;
                        line-height: 24px;
                        margin-top: 12px;
                        box-sizing: border-box;
                        padding-right: 12px;
                        border-right: 1px solid rgba(255, 255, 255, .1);
                        font-size: 16px;
                        font-weight: 700;
                        color: rgba(255, 255, 255, .4);
                        &.light {
                            color: #fff;
                        }
                    }
                    .desc {
                        display: inline-block;
                        vertical-align: top;
                        line-height: 24px;
                        margin: 12px 0 0 12px;
                        color: rgba(255, 255, 255, .4);
                        font-size: 10px;
                    }
                }
                .content-right {
                    flex: 0 0 105px;
                    width: 105px;
                    .pay {
                        height: 48px;
                        line-height: 48px;
                        text-align: center;
                        font-size: 12px;
                        font-weight: 700;
                        color: rgba(255, 255, 255, .4);
                    }
                    &.not-enough {
                        background-color: #2b333b;
                    }
                    &.enough {
                        background-color: #00b43c;
                        .pay {
                            color: #fff;
                        }
                    }
                }
            }
            .ball-container {
                .ball {
                    position: fixed;
                    left: 32px;
                    bottom: 22px;
                    z-index: 200;
                    transition: all .5s;
                    .inner {
                        width: 16px;
                        height: 16px;
                        border-radius: 50%;
                        background-color: rgb(0, 160, 220);
                        transition: all .5s cubic-bezier(.49, -.29, .75, .41);
                    }
                }
            }
            .shopping-list {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                z-index: -1;
                transform: translate3d(0, -100%, 0);
                &.fold-enter-active, &.fold-leave-active{
                    transition: all .5s;
                }
                &.fold-enter, &.fold-leave-to {
                    transform: translate3d(0, 0, 0);
                }

                .list-header {
                    height: 40px;
                    line-height: 40px;
                    padding: 0 18px;
                    background-color: #f3f5f7;
                    border-bottom: 1px solid rgba(7, 17, 27, .1);
                    .title {
                        float: left;
                        font-size: 14px;
                        color: rgb(7, 17, 27);
                    }
                    .empty {
                        float: right;
                        font-size: 12px;
                        color: rgb(0, 160, 220);
                    }
                }
                .list-content {
                    padding: 0 18px;
                    max-height: 217px;
                    background-color: #fff;
                    overflow: hidden;
                    .food {
                        position: relative;
                        padding: 12px 0;
                        box-sizing: border-box;
                        .border-1px(rgba(7, 17, 27, .1));
                        .name {
                            line-height: 24px;
                            font-size: 14px;
                            color: rgb(7, 17, 27);
                        }
                        .price {
                            position: absolute;
                            right: 90px;
                            bottom: 12px;
                            line-height: 24px;
                            font-size: 14px;
                            font-weight: 700;
                            color: rgb(240, 20, 20);
                        }
                        .control-wrapper {
                            position: absolute;
                            right: 0;
                            bottom: 6px;
                        }
                    }
                }
            }
        }
        .list-background {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 40;
            background-color: rgba(7, 17, 27, .6);
            opacity: 1;
            &.fade-enter-active, &.fade-leave-active {
                transition: all .5s;
            }
            &.fade-enter, &.fade-leave-to {
                opacity: 0;
            }
        }
    }
</style>
