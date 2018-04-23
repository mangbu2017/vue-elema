<template>
    <div class="ratingtype">
        <div class="rating-title">
            <span @click="select(2)" class="block good" :class="{active: ratingType === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
            <span @click="select(0)" class="block good" :class="{active: ratingType === 0}">{{desc.good}}<span class="count">{{good}}</span></span>
            <span @click="select(1)" class="block bad" :class="{active: ratingType === 1}">{{desc.bad}}<span class="count">{{bad}}</span></span>
        </div>
        <div @click="toggleContent" class="switch" :class="{on: onlyContent}">
            <span class="icon-check_circle"></span>
            <span class="text">只看有内容的评价</span>
        </div>
    </div>
</template>
<script>
    const GOOD = 0;
    const BAD = 1;
    const ALL = 2;
    export default {
        props: {
            ratings: {
                type: Array,
                default: () => {
                    return [];
                }
            },
            ratingType: {
                type: Number,
                default: ALL
            },
            onlyContent: {
                type: Boolean,
                default: false
            },
            desc: {
                type: Object,
                default: () => {
                    return {
                        all: '全部',
                        good: '满意',
                        bad: '不满意'
                    };
                }
            }
        },
        computed: {
            good() {
                return this.ratings.filter((item) => {
                    return item.rateType === GOOD;
                }).length;
            },
            bad() {
                return this.ratings.filter((item) => {
                    return item.rateType === BAD;
                }).length;
            }
        },
        methods: {
            select(type) {
                // 改变props非引用值会报错
                // this.ratingType = type;
                // 自定义事件方法
                this.$emit('ratingtype', type);
                // 事件巴士方法
            },
            toggleContent() {
                // this.onlyContent = !this.onlyContent;
                this.$emit('onlycontent');
            }
        }
    };
</script>
<style lang="less">
    @import '../../common/less/scale.less';

    .ratingtype {
        .rating-title {
            padding: 18px 0;
            margin: 0 18px;
            .border-1px(rgba(7, 17, 27, .1));
            font-size: 0;
            .block {
                display: inline-block;
                padding: 8px 12px;
                margin-right: 8px;
                border-radius: 1px;
                font-size: 12px;
                line-height: 16px;
                color: rgb(77, 85, 93);
                &.active {
                    color: #fff;
                }
                &.good {
                    background-color: rgba(0, 160, 220, .2);
                    &.active {
                        background-color: rgb(9, 160, 220);
                    }
                }
                &.bad {
                    background-color: rgba(77, 85, 93, .2);
                    &.active {
                        background-color: rgb(77, 85, 93);
                    }
                }
                .count {
                    font-size: 9px;
                    margin-left: 2px;
                }
            }
        }
        .switch {
            padding: 12px 18px;
            line-height: 24px;
            border-bottom: 1px solid rgba(7, 17, 27, .1);
            color: rgb(147, 153, 159);
            font-size: 0;
            &.on {
                .icon-check_circle {
                    color: #00c850
                }
            }
            .icon-check_circle {
                font-size: 24px;
                margin-right: 4px;
                vertical-align: top;
            }
            .text {
                vertical-align: top;
                font-size: 12px;
            }
        }
    }
</style>
