const app = {
    data() {
        return {
            fullUrl: '',
            shortUrl: '',
            apiResponse: {}
        }
    },
    methods: {
        async minify() {
            const urlData = {
                fullUrl: this.fullUrl,
                shortUrl: this.shortUrl
            };

            const result = await fetch('http://localhost:3000/shorten', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(urlData)
            });

            const data = await result.json();
            
            this.apiResponse = data;
        }
    }
}

Vue.createApp(app).mount('#app');