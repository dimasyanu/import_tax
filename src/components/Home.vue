<template>
    <div uk-grid class="uk-grid uk-child-width-1-4@s uk-flex-center">
        <div class="uk-child-width-1-1@s uk-width-2-3@m uk-width-1-1@s">
            <label for="rate" style="margin-left: 12px;">1 USD to IDR: </label>
            <input class="uk-input uk-align-right text-right" type="text" :value="currencyFormat(rate, 'usd')" style="margin-top: -33px;" name="rate" disabled>
        </div>
        <div class="uk-width-2-3@m uk-width-1-1@s">
            <div class="uk-small-grid" uk-grid>
                <div class="uk-width-1-2@m uk-width-1-1@s">
                    <div class="uk-grid-small" uk-grid>
                        <div class="uk-width-1-1">
                            <label for="rate">Free On Board</label>
                            <div class="uk-grid-small" uk-grid>
                                <div class="uk-width-1-3">
                                <select class="uk-select" id="form-stacked-select" v-model="freeOnBoard.currency">
                                    <option value="usd">USD</option>
                                    <option value="idr">IDR</option>
                                </select>
                                </div>
                                <div class="uk-width-2-3">
                                    <input
                                        v-if="freeOnBoard.focused"
                                        ref="freeOnBoard"
                                        class="uk-input text-right nana"
                                        type="number"
                                        placeholder="0"
                                        v-model="freeOnBoard.value"
                                        @blur="freeOnBoard.focused = false"
                                        @focus="$event.currentTarget.select()" />
                                    <input
                                        v-else
                                        class="uk-input text-right"
                                        type="text"
                                        :value="currencyFormat(freeOnBoard.value, freeOnBoard.currency)"
                                        @focus="freeOnBoard.focused = true" />
                                </div>
                            </div>
                        </div>
                        <div class="uk-width-1-3 percentage">
                            <label for="rate">BM</label>
                            <input class="uk-input text-right" type="number" min="0" max="100" placeholder="0" v-model="bm" @change="percentage($event, 'bm')" disabled>
                        </div>
                        <div class="uk-width-1-3 percentage">
                            <label for="rate">PPn</label>
                            <input class="uk-input text-right" type="number" min="0" max="100" placeholder="0" v-model="ppn" @change="percentage($event, 'ppn')">
                        </div>
                        <div class="uk-width-1-3 percentage">
                            <label for="rate">PPh</label>
                            <input class="uk-input text-right" type="number" min="0" max="100" placeholder="0" v-model="pph" @change="percentage($event, 'pph')">
                        </div>
                    </div>
                </div>
                    <!-- <hr class="uk-divider-vertical"> -->
                <div class="uk-width-1-2@m uk-width-1-1@s">
                    <div class="uk-grid-small" uk-grid>
                        <div class="uk-width-1-2">
                            <label for="rate">BM</label>
                            <input class="uk-input text-right" type="text" :value="currencyFormat(resultBM, 'idr')" disabled>
                        </div>
                        <div class="uk-width-1-2">
                            <label for="rate">PPn</label>
                            <input class="uk-input text-right" type="text" :value="currencyFormat(resultPPn, 'idr')" disabled>
                        </div>
                        <div class="uk-width-1-2">
                            <label for="rate">PPh</label>
                            <input class="uk-input text-right" type="text" :value="currencyFormat(resultPPh, 'idr')" disabled>
                        </div>
                        <div class="uk-width-1-2">
                            <label for="rate">Total Pajak</label>
                            <input class="uk-input text-right" type="text" :value="currencyFormat(resultTax, 'idr')" disabled>
                        </div>
                        <div class="uk-width-1-1">
                            <label for="rate">Total</label>
                            <input class="uk-input text-right" type="text" :value="currencyFormat(resultTotal, 'idr')" disabled>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import _set from 'lodash.set';
import config from '../config/app';
import currencyFormat from '../plugins/currency-format';

export default {
    computed: {
        resultBM () {
            var result = this.bm/100 * this.freeOnBoard.value;
            if (this.freeOnBoard.currency === 'usd') {
                result *= this.rate;
            }

            return result;
        },
        resultPPh () {
            return this.pph/100 * (parseFloat(this.freeOnBoard.value) + this.resultBM);
        },
        resultPPn () {
            return this.ppn/100 * (parseFloat(this.freeOnBoard.value) + this.resultBM);
        },
        resultTax () {
            return parseFloat(this.resultBM) + this.resultPPh + this.resultPPn;
        },
        resultTotal () {
            var value = this.freeOnBoard.value;
            if (this.freeOnBoard.currency === 'usd') {
                value *= this.rate;
            }

            return parseFloat(value) + this.resultTax;
        }
    },
    data: function () {
        return {
            bm: config.bm,
            rate: 0,
            freeOnBoard: {
                currency: 'usd',
                focused: false,
                value: 0
            },
            ppn: 10,
            pph: 10
        }
    },
  methods: {
        percentage (event, path) {
            var el = event.currentTarget;
            var min = parseFloat(el.getAttribute('min'));
            var max = parseFloat(el.getAttribute('max'));
            var value = parseFloat(el.value);
            
            if (value < min || !value) {
                _set(this, path, min);
            } else if (value > max) {
                _set(this, path, max);
            } else {
                _set(this, path, value);
            }
        },
        currencyFormat (number, code) {
            return currencyFormat(number, code);
        }
    },
    mounted: function () {
        var self = this;
        var data = JSON.parse(self.$store.getters.getStorageData);
        if (!data || Date.parse(data.updated_at) < (new Date()).setDate(new Date().getDate()-1)) {
            self.$store.dispatch('initStorageData').then(function (results) {
                self.rate = results.rate;
            });
        } else {
            self.rate = data.rate;
        }
    }
}
</script>

<style>
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }

  .uk-grid input.text-right {
    text-align: right;
  }

  .percentage {
    position: relative;
  }

  .percentage > label::after {
    content: "%";
    color: #f0506e;
    position: absolute;
    right: 8px;
    bottom: 8px;
  }

  .percentage > input[type="number"] {
    padding-right: 24px;
    /* color: transparent; */
    /* text-shadow: 0 0 0 #f0506e; */
  }

  .percentage > input[type="number"]:focus {
    outline: none;
  }
</style>