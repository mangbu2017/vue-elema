<template>
    <div class="ratings" ref="ratingsWrapper">
        <div class="ratings-content">
            <div class="view">
                <div class="view-left">
                    <h1 class="score">{{seller.score}}</h1>
                    <div class="title">综合评分</div>
                    <div class="rank">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="view-right">
                    <div class="score-wrapper">
                        <span class="title">服务态度</span>
                        <star :size="36" :score="seller.serviceScore"></star>
                        <span class="score">{{seller.serviceScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">商品评分</span>
                        <star :size="36" :score="seller.foodScore"></star>
                        <span class="score">{{seller.foodScore}}</span>
                    </div>
                    <div class="delivery-wrapper">
                        <span class="title">送达时间</span>
                        <span class="delivery">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <split></split>
            <ratingtype :rating-type="ratingType" :only-content="onlyContent"
            :ratings="ratings" :desc="desc" @ratingtype="onRatingType"
            @onlycontent="onContent"></ratingtype>
            <div class="rating-wrapper">
                <ul>
                    <li v-for="(item, index) in selectContent" class="rating-item" :key="index">
                        <div class="avatar">
                            <img width="28" height="28" :src="item.avatar">
                        </div>
                        <div class="content">
                            <h1 class="name">{{item.username}}</h1>
                            <div class="star-wrapper">
                                <star :size="24" :score="item.score"></star>
                                <span class="delivery" v-show="item.deliveryTime">{{item.deliveryTime}}分钟送达</span>
                            </div>
                            <p class="text">{{item.text}}</p>
                            <div class="recommend" v-show="item.recommend && item.recommend.length">
                                <span class="icon-thumb_up"></span>
                                <span v-for="(one, ind) in item.recommend" :key="ind" class="item">{{one}}</span>
                            </div>
                            <div class="time">
                                {{item.rateTime | formatDate}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import star from '@/components/star/star';
    import split from '@/components/split/split';
    import ratingtype from '@/components/ratingtype/ratingtype';
    import {formatDate} from '@/common/js/dataFormat';
    import BScroll from 'better-scroll';

    const GOOD = 0;
    const BAD = 1;
    const ALL = 2;

    export default {
        data() {
            return {
                ratingType: ALL,
                onlyContent: false,
                desc: {
                    all: '全部',
                    good: '推荐',
                    bad: '吐槽'
                },
                ratings: []
            };
        },
        props: {
            seller: {
                type: Object
            }
        },
        methods: {
            onRatingType(type) {
                this.ratingType = type;
            },
            onContent() {
                this.onlyContent = !this.onlyContent;
            }
        },
        computed: {
            selectType() {
                let rat = this.ratings;

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
        created() {
            this.$http.get('/api/ratings').then((res) => {
                this.ratings = res.body;
                this.$nextTick(() => {
                    this.scroll = new BScroll(this.$refs.ratingsWrapper, {
                        click: true
                    });
                });
            });
        },
        filters: {
            formatDate(time) {
                let date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm');
            }
        },
        components: {
            star,
            split,
            ratingtype
        }
    };
</script>
<style lang="less">
    @import '../../common/less/scale.less';

    .ratings {
        position: absolute;
        top: 174px;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        .view {
            display: flex;
            padding: 18px 0;
            .view-left {
                flex: 0 0 137px;
                padding: 6px 0;
                width: 137px;
                border-right: 1px solid rgba(7, 17, 27, .1);
                text-align: center;
                @media screen and (max-width: 320px) {
                    flex: 0 0 120px;
                    width: 120px;
                }
                .score {
                    margin-bottom: 6px;
                    line-height: 28px;
                    font-size: 24px;
                    color: rgb(255, 153, 0);
                }
                .title {
                    margin-bottom: 8px;
                    line-height: 12px;
                    font-size: 12px;
                    color: rgb(7, 17, 27);
                }
                .rank {
                    line-height: 10px;
                    font-size: 10px;
                    color: rgb(147, 153, 159);
                }
            }
            .view-right {
                padding-top: 6px;
                flex: 1;
                padding-left: 24px;
                // 小屏响应布局
                @media screen and (max-width: 320px) {
                    padding-left: 6px;
                }
                .score-wrapper {
                    margin-bottom: 8px;
                    font-size: 0;
                    .title {
                        display: inline-block;
                        vertical-align: top;
                        line-height: 18px;
                        font-size: 12px;
                        color: rgb(7, 17, 27);
                    }
                    .star {
                        display: inline-block;
                        margin: 0 12px;
                        vertical-align: top;
                    }
                    .score {
                        line-height: 18px;
                        display: inline-block;
                        vertical-align: top;
                        font-size: 12px;
                        color: rgb(255, 153, 0);
                    }
                }
                .delivery-wrapper {
                    font-size: 0;
                    .title {
                        line-height: 18px;
                        font-size: 12px;
                        color: rgb(7, 17, 27);
                    }
                    .delivery {
                        font-size: 12px;
                        color: rgb(147, 153, 159);
                        margin-left: 12px;
                    }
                }
            }
        }
        .rating-wrapper {
            padding: 0 18px;
            .rating-item {
                display: flex;
                padding: 18px 0;
                .border-1px(rgba(7, 17, 27, .1));
                .avatar {
                    flex: 0 0 28px;
                    width: 28px;
                    margin-right: 12px;
                    img {
                        border-radius: 50%;
                    }
                }
                .content {
                    position: relative;
                    flex: 1;
                    .name {
                        margin-bottom: 4px;
                        line-height: 12px;
                        font-size: 10px;
                        color: rgb(7, 17, 27);
                    }
                    .star-wrapper {
                        margin-bottom: 6px;
                        font-size: 0;
                        .star {
                            display: inline-block;
                            margin-right: 6px;
                            vertical-align: top;
                        }
                        .delivery {
                            display: inline-block;
                            vertical-align: top;
                            color: rgb(147, 153, 159);
                            line-height: 12px;
                            font-size: 10px;
                        }
                    }
                    .text {
                        line-height: 18px;
                        margin-bottom: 8px;
                        color: rgb(7, 17, 27);
                        font-size: 12px;
                    }
                    .recommend {
                        font-size: 0;
                        line-height: 16px;
                        .icon-thumb_up, .item{
                            display: inline-block;
                            margin: 0 8px 4px 0;
                            font-size: 9px;
                        }
                        .icon-thump_up {
                            color: rgb(0, 160, 220);
                        }
                        .item {
                            padding: 0 6px;
                            border: 1px solid rgba(7, 17, 27, .1);
                            border-radius: 1px;
                            color: rgb(147, 153, 159);
                            background-color: #fff;
                        }
                    }
                    .time {
                        position: absolute;
                        top: 0;
                        right: 0;
                        color: rgb(147, 153, 159);
                    }
                }
            }
        }
    }
</style>
