import axios from 'axios';
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        appName: process.env.VUE_APP_NAME,
        storageData: localStorage.getItem('rateData')
    },
    getters: {
        getAppName (state) {
            return state.appName;
        },
        getStorageData (state) {
            return state.storageData;
        }
    },
    mutations: {
        setStorageData (state, payload) {
            localStorage.setItem('rateData', payload);
            state.storageData = payload;
        }
    },
    actions: {
        initStorageData ({ commit }) {
            return new Promise(function (resolve, reject) {
                axios.get('https://api.exchangeratesapi.io/latest?base=USD')
                    .then(function (response) {
                        let data = {
                            rate: response.data.rates.IDR,
                            updated_at: new Date().toLocaleString()
                        };
                        
                        commit('setStorageData', JSON.stringify(data));

                        resolve(data);
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            });
        }
    }
})
