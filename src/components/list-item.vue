<template>
    <div class="item">
        <div class="item__wrapper" :class="object.done ? 'item__wrapper_done': ''">
            <!--<div class="item__number">{{ number }})</div>-->
            <div class="item__name" :class="object.done ? 'item__name_done': ''" @click="changeStatus({uid: object.uid, done: object.done})">{{ object.name }}</div>
            <div class="item__actions">
                <button
                    class="item__actions-btn item__actions-detail"
                    @click="$router.push(`/${object.uid}`)"
                >
                    <i class="fa fa-info" ></i>
                    <span>Details</span>
                </button>

            </div>
        </div>
    </div>
</template>

<script>
    import { db } from '../main'
    export default {
        props: {
            object: {
                type: Object,
                required: true,
                default: () => { return {}}
            },
            number: {
                type: Number
            }
        },
        data(){
            return{ }
        },
        methods: {
            changeStatus({uid, done}){
                this.$emit('changeStatus', {uid, done});
            },
        }
    }
</script>

<style lang="scss">

</style>