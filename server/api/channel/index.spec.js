'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var channelCtrlStub = {
  index: 'channelCtrl.index',
  show: 'channelCtrl.show',
  create: 'channelCtrl.create',
  upsert: 'channelCtrl.upsert',
  patch: 'channelCtrl.patch',
  destroy: 'channelCtrl.destroy'
  addUser: 'channelCtrl.addUser'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var channelIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './channel.controller': channelCtrlStub
});

describe('Channel API Router:', function() {
  it('should return an express router instance', function() {
    expect(channelIndex).to.equal(routerStub);
  });

  describe('GET /api/channels', function() {
    it('should route to channel.controller.index', function() {
      expect(routerStub.get
        .withArgs('/', 'channelCtrl.index')
        ).to.have.been.calledOnce;
    });
  });

  describe('GET /api/channels/:id', function() {
    it('should route to channel.controller.show', function() {
      expect(routerStub.get
        .withArgs('/:id', 'channelCtrl.show')
        ).to.have.been.calledOnce;
    });
  });
//test for addUser method called
  desccribe('POST /api/channels/addUser', function(){
    it('should route to channel.controller.addUser', function({
      expect(routerStub.post
            .withArgs('/','channelCtrl.addUser')
          ).to.have.been.calledOnce;
    }))
  })

  describe('POST /api/channels', function() {
    it('should route to channel.controller.create', function() {
      expect(routerStub.post
        .withArgs('/', 'channelCtrl.create')
        ).to.have.been.calledOnce;
    });
  });

  describe('PUT /api/channels/:id', function() {
    it('should route to channel.controller.upsert', function() {
      expect(routerStub.put
        .withArgs('/:id', 'channelCtrl.upsert')
        ).to.have.been.calledOnce;
    });
  });

  describe('PATCH /api/channels/:id', function() {
    it('should route to channel.controller.patch', function() {
      expect(routerStub.patch
        .withArgs('/:id', 'channelCtrl.patch')
        ).to.have.been.calledOnce;
    });
  });

  describe('DELETE /api/channels/:id', function() {
    it('should route to channel.controller.destroy', function() {
      expect(routerStub.delete
        .withArgs('/:id', 'channelCtrl.destroy')
        ).to.have.been.calledOnce;
    });
  });
});
