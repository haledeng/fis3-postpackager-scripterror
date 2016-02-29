/**
 * test main file
 * @author helondeng
 * @date 2015-09-12
 */


var path = require('path');
var fs = require('fs');
var fis = require('fis3');
var _ = fis.util;
var expect = require('chai').expect;
var _release = fis.require('command-release/lib/release.js');
var _deploy = fis.require('command-release/lib/deploy.js');
var root = path.join(__dirname, 'src');
var dev = path.join(__dirname, 'dev');

fis.project.setProjectRoot(root);
var _self = require('../index');


function wrapper(options) {
    return function(ret, pack, settings, opt) {
        _.assign(settings, options);
        return _self.call(this, ret, pack, settings, opt);
    }
}

function release(opts, cb) {
    opts = opts || {};

    _release(opts, function(error, info) {
        _deploy(info, cb);
    });
}



describe('fis3-postpackager-script', function() {

    beforeEach(function() {


        _.del(dev);

        fis.match('::package', {
            postpackager: wrapper({
                onerror: 'window.scripterror && window.scripterror(this)'
            })
        });

        fis.match('*', {
            deploy: fis.plugin('local-deliver', {
                to: dev
            })
        });

    });

    it('onerror', function(done) {

        release({
            unique: true
        }, function() {
            done();
            var content = fs.readFileSync(path.join(dev, 'index.html')).toString();
            expect(content.indexOf('onerror="window.scripterror && window.scripterror(this)"') > -1).to.be.true;
            fis.log.info('release complete');
        });
    });
});
