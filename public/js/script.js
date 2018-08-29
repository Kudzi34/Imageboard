(function() {
    var app = new Vue({
        el: "#main",
        data: {
            images: [],
            form: {
                title: "",
                username: "",
                description: ""
            }
        },
        mounted: function() {
            axios.get("/images").then(function(res) {
                console.log();
                app.images = res.data;
            });
        },
        methods: {
            uploadFile: function(e) {
                e.preventDefault();
                var file = $("input[type=file]").get(0).files[0];
                console.log(file);
                var formData = new FormData();
                formData.append("file", file);
                formData.append("title", this.form.title);
                formData.append("description", this.form.description);
                formData.append("username", this.form.username);

                axios.post("/upload", formData).then(function(res) {
                    console.log("res in POST/upload", res);
                    app.images.unshift(res.data.image);
                });
            }
        }
    });
})();
