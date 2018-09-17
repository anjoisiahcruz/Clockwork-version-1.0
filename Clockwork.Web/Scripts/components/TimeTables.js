export var timeTable = Vue.component('timeTable', {
    data() {
        return {
            currentTime: {},
            pageNumber: 0
        };
    },
    props: {
        tableData: {
            type: Array,
            required: true
        },
        addData: {
            type: Function,
            required: true
        },
        size: {
            type: Number,
            required: false,
            default: 10
        }
    },
    computed: {
        pageCount() {
            let l = this.tableData.length,
                s = this.size;
            return Math.ceil(l / s);
        },
        paginatedData() {
            const start = this.pageNumber * this.size,
                end = start + this.size;
            return this.tableData.slice(start, end);
        }
    },
    methods: {
        addTimeEntry: function () {
            post({
                url: "http://127.0.0.1:55145/api/currenttime",
                callBackFunction: (responseText) => {
                    this.addData(JSON.parse(responseText));
                }
            });
        },
        nextPage() {
            this.pageNumber++;
        },
        prevPage() {
            this.pageNumber--;
        }
    },
    filters: {
        formatDate: function (value) {
            if (value) {
                return moment(String(value)).format('dddd, MMMM Do, YYYY hh:mm:ss a');
            }
        }
    },
    template:
        `
        <div>
            <div class="row justify-content-between">
                <div class="col-md-3 col-sm-12 mb-lg-0 mb-sm-3">
                    <nav>
                        <ul class="pagination">
                        <li class="page-item">
                            <button class="page-link text-dark" :disabled="pageNumber === 0" @click="prevPage">Previous</button>
                        </li>
                        <li class="page-item">
                            <button class="page-link bg-dark text-white" :disabled="pageNumber >= pageCount - 1" @click="nextPage">Next</button>
                        </li>
                        </ul>
                    </nav>
                </div>
                <div class="col-md-3 col-sm-12 get-time">
                    <button class="btn btn-primary" type="submit" v-on:click="addTimeEntry">Get the time</button>
                </div>
            </div>
            <div class="row">
                <div id="output" class="col-12">
                    <div class="row justify-content-between">
                        <p class="col-md-4 col-sm-12">Total Number of Items: {{ this.tableData.length }}</p>
                        <p class="col-md-3 col-sm-12 align-right">Page {{ pageNumber + 1 }} of {{ pageCount }} pages</p>
                    </div>
                    <div class="table-responsive-sm">
                        <table class="table">
                            <thead class="thead-dark">
                                <th scope="col">#</th>
                                <th scope="col">Time</th>
                                <th scope="col">Client IP</th>
                                <th scope="col">UTC Time</th>
                            </thead>
                            <tbody>
                                <tr v-for="entry in paginatedData">
                                    <th scope="row">{{entry.currentTimeQueryId}}</th>
                                    <td>{{entry.time | formatDate}}</td>
                                    <td>{{entry.clientIp}}</td>
                                    <td>{{entry.utcTime | formatDate}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>`
});