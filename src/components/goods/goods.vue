<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menuScroll">
            <ul>
                <li v-for="(item, index) in goods" :key="index" class="menu-item" :class="{current: currentIndex === index}"
                @click="selectMenu(index, $event)">
                    <span class="text border-1px">
                        <span v-show="item.type > 0" class="icon" :class="classes[item.type]"></span>
                        {{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foodScroll">
            <ul ref="ul">
                <li v-for="(item, index) in goods" :key="index" class="food-list" ref="foodList">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="(food, index) in item.foods" :key="index" class="food-item" @click="onSelectFood(food, $event)">
                            <div class="icon">
                                <img :src="food.icon" width="57">
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                                </div>
                                <div class="control-wrapper">
                                    <!--这里接收到子组件传来的事件 然后调用另一个组件的方法 实现兄弟组件通信-->
                                    <addcontrol :food="food" @con-add="onReceivePos"></addcontrol>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <shopping ref="shopping" :select-foods="selectFoods" :price="seller.deliveryPrice" :min-price="seller.minPrice"></shopping>
        <food :food="selectFood" ref="food"></food>
    </div>
</template>
<script>
    import BScroll from 'better-scroll';
    import shopping from '@/components/shopping/shopping';
    import addcontrol from '@/components/addcontrol/addcontrol';
    import food from '@/components/food/food';

    export default {
        data() {
            return {
                goods: [],
                classes: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
                heightList: [],
                scrollY: 0,
                selectFood: {}
            };
        },
        props: ['seller'],
        created() {
            this.$http.get('/api/goods').then((res) => {
                this.goods = res.body;
                this.$nextTick(() => {
                    this.initScroll();
                    this.computeHeight();
                });
            });
        },
        computed: {
            currentIndex() {
                for (let i = 0; i < this.heightList.length - 1; i++) {
                    let upHeight = this.heightList[i];
                    let downHeight = this.heightList[i + 1];
                    if ((this.scrollY >= upHeight && this.scrollY < downHeight)) {
                        return i;
                    }
                }
                return 0;
            },
            selectFoods() {
                let foods = [];
                this.goods.forEach((item) => {
                    item.foods.forEach((food) => {
                        if (food.count) {
                            foods.push(food);
                        }
                    });
                });
                return foods;
            }
        },
        methods: {
            onSelectFood(food) {
                this.selectFood = food;
                this.$refs.food.show();
            },
            selectMenu(index, e) {
                this.foodScroll.scrollToElement(this.$refs.foodList[index], 300);
            },
            initScroll() {
                this.menuScroll = new BScroll(this.$refs.menuScroll, {
                    click: true
                });
                this.foodScroll = new BScroll(this.$refs.foodScroll, {
                    click: true,
                    probeType: 3
                   // 实时监控
                });
                this.foodScroll.on('scroll', (pos) => {
                    // y是负值
                    this.scrollY = Math.abs(Math.round(pos.y));
                });
            },
            computeHeight() {
                let foodList = this.$refs.foodList;
                let height = 0;
                this.heightList.push(height);
                for (let i = 0; i < foodList.length; i++) {
                    height += foodList[i].offsetHeight;
                    this.heightList.push(height);
                }
            },
            onReceivePos(target) {
                // 优化体验, 异步执行下落动画
                this.$nextTick(() => {
                    this.$refs.shopping.drop(target);
                });
            }
        },
        components: {
            shopping,
            addcontrol,
            food
        }
    };
</script>
<style lang="less">
    @import '../../common/less/scale.less';

    .goods {
        position: absolute;
        top: 174px;
        bottom: 46px;
        width: 100%;
        display: flex;
        overflow: hidden;
        .menu-wrapper {
            // grow shrink basis
            // height: 100%;
            flex: 0 0 80px;
            // android兼容
            width: 80px;
            background-color: #f3f5f7;
            .menu-item {
                padding: 0 12px;
                display: table;
                height: 54px;
                width: 56px;
                line-height: 14px;
                &.current {
                    position: relative;
                    margin-top: -1px;
                    font-weight: 700;
                    background-color: #fff;
                    .text {
                        .border-none();
                    }
                }
                .icon {
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    vertical-align: top;
                    margin-right: 2px;
                    background-size: 16px 16px;
                    background-repeat: no-repeat;
                    // 打折
                    &.decrease {
                        .bg-image('decrease_3')
                    }
                    // 打折
                    &.discount {
                        .bg-image('discount_3')
                    }
                    // 担保
                    &.guarantee {
                        .bg-image('guarantee_3')
                    }
                    &.invoice {
                        .bg-image('invoice_3')
                    }
                    // 套餐
                    &.special {
                        .bg-image('special_3')
                    }
                }
                .text {
                    display: table-cell;
                    width: 56px;
                    vertical-align: middle;
                    .border-1px(rgba(7, 17, 27, .1));
                    font-size: 12px;
                }
            }
        }
        .foods-wrapper {
            flex: 1;
            height: 100%;
            .title {
                padding-left: 14px;
                height: 26px;
                line-height: 26px;
                border-left: 2px solid #d9dde1;
                font-size: 12px;
                color: rgb(147, 153, 159);
                background-color: #f3f5f7
            }
            .food-item {
                display: flex;
                margin: 18px;
                padding-bottom: 18px;
                .border-1px(rgba(7, 17, 27, .1));
                &:last-child {
                    .border-none();
                    margin-bottom: 0;
                }
                .icon {
                    flex: 0 0 57px;
                    margin-right: 10px;
                }
                .content {
                    flex: 1;
                    .name {
                        margin: 2px 0 8px 0;
                        height: 14px;
                        line-height: 14px;
                        font-size: 14px;
                        color: rgb(7, 17, 27);
                    }
                    .desc, .extra {
                        line-height: 10px;
                        font-size: 10px;
                        color: rgb(147, 153, 159);
                    }
                    .desc {
                        line-height: 13px;
                        margin-bottom: 8px;
                    }
                    .extra {
                        .count {
                            margin-right: 12px;
                        }
                    }
                    .price {
                        font-weight: 700;
                        line-height: 24px;
                        .now {
                            margin-right: 8px;
                            font-size: 14px;
                            color: rgb(240, 20, 20);
                        }
                        .old {
                            text-decoration: line-through;
                            font-size: 10px;
                            color: rgb(147, 153, 159);
                        }
                    }
                    .control-wrapper {
                        position: absolute;
                        right: 0;
                        bottom: 12px;
                    }
                }
            }
        }
    }
</style>
