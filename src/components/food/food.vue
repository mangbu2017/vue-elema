<template>
    <transition name="move">
        <div class="food" v-show="showInfo" ref="foodWrapper">
            <div class="foodInner">
                <div class="image-wrapper">
                    <img :src="food.image">
                    <div class="back" @click="show">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>
                <div class="content">
                    <h1 class="title">{{food.name}}</h1>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                    </div>
                    <div class="control-wrapper">
                        <addcontrol :food="food"></addcontrol>
                    </div>
                    <div @click="addFood($event)" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
                </div>
                <split></split>
                <div class="info" v-if="food.info">
                    <h1 class="title">商品介绍</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <div class="rating">
                    <h1 class="title">商品评价</h1>
                    <ratingtype :rating-type="ratingType" :only-content="onlyContent" :ratings="food.ratings" :desc="desc" @ratingtype="onRatingType" @onlycontent="onContent"></ratingtype>
                    <div class="rating-wrapper">
                        <ul v-if="food.ratings && food.ratings.length">
                            <li v-for="(item, index) in selectContent" :key="index" class="rating-item">
                                <div class="user">
                                    <span class="name">{{item.username}}</span>
                                    <img :src="item.avatar" class="avatar" width="12" height="12">
                                </div>
                                <div class="time">{{item.rateTime | formatDate}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up': item.rateType === 0,
                                    'icon-thumb_down': item.rateType === 1}"></span>{{item.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-else>暂无评价</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    import BScroll from 'better-scroll';
    import addcontrol from '@/components/addcontrol/addcontrol';
    import split from '@/components/split/split';
    import ratingtype from '@/components/ratingtype/ratingtype';
    import {formatDate} from '@/common/js/dataFormat';

    const GOOD = 0;
    const BAD = 1;
    const ALL = 2;

    export default {
        data() {
            return {
                showInfo: false,
                ratingType: ALL,
                onlyContent: false,
                desc: {
                    all: '全部',
                    good: '推荐',
                    bad: '吐槽'
                }
            };
        },
        props: {
            food: {
                type: Object
            }
        },
        created() {
            this.$nextTick(() => {
                this.scroll = new BScroll(this.$refs.foodWrapper, {
                    click: true
                });
            });
        },
        computed: {
            selectType() {
                let rat = this.food.ratings;

                switch (this.ratingType) {
                    case ALL:
                        return rat;
                    case GOOD:
                        return rat.filter((item) => {
                            return item.rateType === GOOD;
                        });
                    case BAD:
                        return rat.filter((item) => {
                            return item.rateType === BAD;
                        });
                    default:
                        return rat;
                }
            },
            selectContent() {
                if (this.onlyContent) {
                    return this.selectType.filter((item) => {
                        return item.text.length !== 0;
                    });
                }
                return this.selectType;
            }
        },
        methods: {
            onRatingType(type) {
                this.ratingType = type;
            },
            onContent() {
                this.onlyContent = !this.onlyContent;
            },
            show() {
                this.showInfo = !this.showInfo;
            },
            addFood(e) {
                this.$set(this.food, 'count', 1);
                this.$root.Bus.$emit('bus', e.target);
            }
        },
        filters: {
            formatDate(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
        },
        components: {
            addcontrol,
            split,
            ratingtype
        }
    };
</script>
<style lang="less">
    @import '../../common/less/scale.less';

    .food {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 48px;
        z-index: 30;
        background-color: #fff;
        &.move-enter-active, &.move-leave-active {
            transition: all .5s;
        }
        &.move-enter, &.move-leave-to {
            transform: translate3d(100%, 0, 0);
        }
        .image-wrapper {
            position: relative;
            width: 100%;
            height: 0;
            // 相对应宽度
            padding-top: 100%;
            img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }
            .back {
                position: fixed;
                top: 10px;
                left: 0px;
                .icon-arrow_lift {
                    display: block;
                    padding: 10px;
                    font-size: 20px;
                    color: #fff;
                }
            }

        }
        .content {
            position: relative;
            padding: 18px;
            .title {
                line-height: 14px;
                margin-bottom: 8px;
                font-size: 14px;
                font-weight: 700;
                color: rgb(7, 17, 27);
            }
            .detail {
                margin-bottom: 18px;
                line-height: 10px;
                font-size: 0;
                .sell-count, .rating {
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                }
                .sell-count {
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
                right: 12px;
                bottom: 12px;
            }
            .buy {
                position: absolute;
                right: 18px;
                bottom: 18px;
                z-index: 10;
                height: 24px;
                line-height: 24px;
                padding: 0 12px;
                box-sizing: border-box;
                font-size: 10px;
                border-radius: 12px;
                color: #fff;
                background-color: rgb(0, 160, 220);
            }
        }
        .info {
            padding: 18px;
            .title {
                line-height: 14px;
                margin-bottom: 16px;
                font-size: 14px;
                color: rgb(7, 17, 27);
            }
            .text {
                line-height: 24px;
                padding: 0 8px;
                font-size: 12px;
                color: rgb(77, 85, 93);
            }
        }
        .rating {
            padding-top: 18px;
            .title {
                line-height: 14px;
                margin-left: 18px;
                font-size: 14px;
                color: rgb(7, 17, 27);
            }
            .rating-wrapper {
                padding: 0 18px;
                .rating-item {
                    position: relative;
                    padding: 16px 0;
                    .border-1px(rgba(7, 17, 27, .1));
                    .user {
                        position: absolute;
                        right: 0;
                        top: 16px;
                        font-size: 0;
                        .name {
                            margin-right: 6px;
                            display: inline-block;
                            vertical-align: top;
                            font-size: 10px;
                            color: rgb(147, 153, 159);
                        }
                        .avatar {
                            border-radius: 50%;
                        }
                    }
                    .time {
                        margin-bottom: 6px;
                        line-height: 12px;
                        font-size: 10px;
                        color: rgb(147, 153, 159);
                    }
                    .text {
                        line-height: 16px;
                        font-size: 12px;
                        color: rgb(7, 17, 27);
                        .icon-thumb_up, .icon-thumb_down {
                            margin-right: 4px;
                            line-height: 16px;
                            font-size: 12px;
                        }
                        .icon-thumb_up {
                            color: rgb(0, 160, 220);
                        }
                        .cion-thumb_down {
                            color: rgb(147, 153, 159);
                        }
                    }
                }
                .no-rating {
                    padding: 16px 0;
                    font-size: 12px;
                    color: rgb(147, 153, 159);
                }
            }
        }
    }
</style>
