var defaultAccessLevels = {
    "Administrator": 1,
    "Content Editor": 2,
    "Content Viewer": 3
};

module.exports = {
    getByName: function(name){
        return defaultAccessLevels[name] || null;
    },
    allAsJson: function(){
        return JSON.stringify(this.all());
    },
    all: function(){
        var accessLevels = [];
        for(var al in defaultAccessLevels){
            accessLevels.push(defaultAccessLevels[al]);
        }
        return accessLevels;
    }    
};