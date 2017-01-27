var defaultAccessLevels = {
    "Administrator": 1,
    "Content Editor": 2,
    "View Only": 3
};

module.exports = {
    getByName: function(name){
        return defaultAccessLevels[name] || null;
    },
    allAsString: function(){
        return this.all().join();
    },
    all: function(){
        var accessLevels = [];
        for(var al in defaultAccessLevels){
            accessLevels.push(defaultAccessLevels[al]);
        }
        return accessLevels;
    }    
};