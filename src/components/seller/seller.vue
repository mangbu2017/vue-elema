<template>
    <div class="seller" ref="sellWrapper">
        <div class="seller-content">
            <div class="view">
                <h1 class="title">{{seller.name}}</h1>
                <div class="desc">
                    <star :size="36" score="seller.score"></star>
                    <span class="text">({{seller.ratingCount}})</span>
                    <div class="text">月售{{seller.sellCount}}单</div>
                </div>
                <ul class="remark">
                    <li class="block">
                        <h2>起送价</h2>
                        <div class="content">
                            <span class="big">{{seller.minPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>商家配送</h2>
                        <div class="content">
                            <span class="big">{{seller.deliveryPrice}}</span>元
                        </div>
                    </li>
                    <li class="block">
                        <h2>平均配送时间</h2>
                        <div class="content">
                            <span class="big">{{seller.deliveryTime}}</span>元
                        </div>
                    </li>
                </ul>
                <div class="collect" @click="toggleCollect">
                    <span class="icon-favorite" :class="{active: collected}"></span>
                    <span class="text">{{text}}</span>
                </div>
            </div>
            <split></split>
            <div class="tell">
                <h1 class="title">公告与活动</h1>
                <div class="content-wrapper">
                    <p class="content">{{seller.bulletin}}</p>
                </div>
                <ul v-if="seller.supports" class="supports">
                    <li class="supports-item" v-for="(item, index) in seller.supports" :key="index">
                        <span class="icon" :class="classes[index]"></span>
                        <span class="text">{{seller.supports[index].description}}</span>
                    </li>
                </ul>
            </div>
            <split></split>
            <div class="pics">
                <h1 class="title">商家实景</h1>
                <div class="pics-wrapper" ref="picsWrapper">
                    <ul class="pics-list" ref="picsList">
                        <li class="pics-item" v-for="(item, index) in seller.pics" :key="index">
                            <img :src="item" width="120" height="90">
                        </li>
                    </ul>
                </div>
            </div>
            <split></split>
            <div class="info">
                <h1 class="title">商家信息</h1>
                <ul>
                    <li class="info-item" v-for="(item, index) in seller.infos" :key="index">{{item}}</li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import star from '@/components/star/star';
    import split from '@/components/split/split';
    import BScroll from 'better-scroll';

    export default {
        data() {
            return {
                classes: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
                collected: false
            };
        },
        props: {
            seller: {
                type: Object
            }
        },
        computed: {
            text() {
                return this.collected ? '已收藏' : '未收藏';
            }
        },
        mounted() {
            this.scroll = new BScroll(this.$refs.sellWrapper, {
                click: true
            });
            this.initPics();
        },
        methods: {
            initPics() {
                if (this.seller.pics) {
                    let width = (120 + 6) * this.seller.pics.length;
                    this.$refs.picsList.style.width = (width - 6) + 'px';
                    this.$nextTick(() => {
                        if (!this.xScroll) {
                            this.xScroll = new BScroll(this.$refs.picsWrapper, {
                                scrollX: true
                                // eventPassthrough: 'vertical'
                            });
                        } else {
                            this.xScroll.refresh();
                        }
                    });
                }
            },
            toggleCollect() {
                this.collected = !this.collected;
                // setStorage(this.seller.id, 'collected', this.collected);
            }
        },
        watch: {
            seller() {
                this.initPics();
            }
        },
        components: {
            star,
            split
        }
    };
</script>
<style lang="less">
    @import '../../common/less/scale.less';

    .seller {
        position: absolute;
        top: 174px;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        .view {
            padding: 18px;
            position: relative;
            .title {
                margin-bottom: 8px;
                line-height: 14px;
                color: rgb(7, 17, 27);
                font-size: 14px;
            }
            .desc {
                padding-bottom: 18px;
                line-height: 18px;
                .border-1px(rgba(7, 17, 27, .1));
                font-size: 0;
                .star {
                    display: inline-block;
                    margin-right: 8px;
                    vertical-align: top;
                }
                .text {
                    margin-right: 12px;
                    display: inline-block;
                    vertical-align: top;
                    font-size: 10px;
                    color: rgb(74, 85, 93);
                }
            }
            .remark {
                display: flex;
                padding-top: 18px;
                .block {
                    flex: 1;
                    text-align: center;
                    border-right: 1px solid rgba(7, 17, 27, .1);
                    &:last-child {
                        border: none;
                    }
                    h2 {
                        margin-bottom: 4px;
                        line-height: 10px;
                        font-size: 10px;
                        color: rgb(147, 153, 159);
                    }
                    .content {
                        line-height: 24px;
                        font-size: 10px;
                        color: rgb(7, 17, 27);
                        .big {
                            font-size: 24px;
                        }
                    }
                }
            }
            .collect {
                position: absolute;
                top: 18px;
                right: 18px;
                text-align: center;
                .icon-favorite {
                    display: block;
                    color: #d4d6d9;
                    margin-bottom: 4px;
                    line-height: 24px;
                    font-size: 24px;
                    &.active {
                        color: rgb(240, 20, 20);
                    }
                }
                .text {
                    line-height: 10px;
                    font-size: 13px;
                    color: rgb(77, 85, 93);
                }
            }
        }
        .tell {
            padding: 18px 18px 0 18px;
            .title {
                margin-bottom: 8px;
                line-height: 14px;
                color: rgb(7, 17, 27);
                font-size: 14px;
            }
            .content-wrapper {
                padding: 0 12px 16px 12px;
                .border-1px(rgba(7, 17, 27, .1));
                .content {
                    line-height: 24px;
                    color: rgb(240, 20, 20);
                }
            }
            .supports {
                .supports-item {
                    padding: 16px 12px;
                    .border-1px(rgba(7, 17, 27, .1));
                    font-size: 0;
                    &:last-child {
                        .border-none;
                    }
                }
                .icon{
                    vertical-align: top;
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    margin-right: 6px;
                    background-size: 16px 16px;
                    background-repeat: no-repeat;
                    // 打折
                    &.decrease {
                        .bg-image('decrease_4')
                    }
                    // 打折
                    &.discount {
                        .bg-image('discount_4')
                    }
                    // 担保
                    &.guarantee {
                        .bg-image('guarantee_4')
                    }
                    &.invoice {
                        .bg-image('invoice_4')
                    }
                    // 套餐
                    &.special {
                        .bg-image('special_4')
                    }
                }
                .text {
                    line-height: 16px;
                    font-size: 12px;
                    color: rgb(7, 17, 27);
                }
            }
        }
        .pics {
            padding: 18px;
            .title {
                margin-bottom: 12px;
                line-height: 14px;
                color: rgb(7, 17, 27);
                font-size: 14px;
            }
            .pics-wrapper {
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
                .pics-list {
                    font-size: 0;
                    .pics-item {
                        display: inline-block;
                        margin-right: 6px;
                        width: 120px;
                        height: 90px;
                        &:last-child {
                            margin: 0;
                        }
                    }
                }
            }
        }
        .info {
            padding: 18px 18px 0 18px;
            color: rgb(7, 17, 27);
            .title {
                padding-bottom: 12px;
                line-height: 14px;
                .border-1px(rgba(7, 17, 27, .1));
                font-size: 14px;
            }
            .info-item {
                padding: 16px 12px;
                line-height: 16px;
                .border-1px(rgba(7, 17, 27, .1));
                &:last-child {
                    .border-none;
                }
            }
        }
    }
</style>
