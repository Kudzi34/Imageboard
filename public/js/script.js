(function() {
    Vue.component("image-component", {
        props: ["id"],
        template: "#template1",
        data: function() {
            return {
                info: [],
                comments: [],
                form: {
                    comment: "",
                    username: ""
                }
            };
        },

        mounted: function() {
            console.log("this Id:", this.id);
            var app = this;
            axios.get("/images/" + this.id).then(res => {
                //                console.log("somthing is here", res.data[0]);
                app.info = res.data[0];

                app.comments = app.comments.concat(res.data);
                //console.log(app.info);
            });
        },

        methods: {
            closePopup: function() {
                this.$emit("close");
            },

            addComments: function(event) {
                event.preventDefault();
                var app = this;
                var commentInfo = {
                    user_id: this.id,
                    comment: this.form.comment,
                    username: this.form.username
                };

                axios.post("/images/" + this.id, commentInfo).then(res => {
                    console.log(commentInfo);
                    app.comments.unshift(res.data[0]);
                });
            }
        }
        ///
    });
    var app = new Vue({
        el: "#main",
        data: {
            images: [],
            id: "",
            show: "",
            form: {
                title: "",
                username: "",
                description: ""
            }
        },
        mounted: function() {
            axios.get("/images").then(function(res) {
                app.images = res.data;
            });
        },
        methods: {
            uploadFile: function(e) {
                e.preventDefault();
                var file = $("input[type=file]").get(0).files[0];
                var formData = new FormData();
                formData.append("file", file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);

                axios.post("/upload", formData).then(function(res) {
                    app.images.unshift(res.data.image);
                });
            },
            hide: function() {
                if (this.show === true) {
                    this.show = false;
                }
            },
            setCurrentImage: function(image_id) {
                this.id = image_id;
                this.show = true;
                console.log("Our Id is here: ", image_id);
                console.log(this.id);
                axios.post("/images/" + image_id).then(response => {
                    //     console.log("I am a hero", response);
                });
            }
        }
    });
})();
