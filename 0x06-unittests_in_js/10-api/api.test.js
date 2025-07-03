#!/usr/bin/env node

const { expect } = require('chai');
const { describe, it } = require('mocha');
const request = require('request');

const url = 'http://localhost:7865';

describe('Payment API Integration', () => {
  describe('Index Page', () => {
    it('should have a body', (done) => {
      request(url, (error, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.not.be.an('undefined');
        done();
      });
    });

    it('should have 200 as its status code', (done) => {
      request(url, (error, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('should correctly display the welcome message', () => {
      request(url, (error, res) => {
        expect(res.body).to.equal('Welcome to the payment system');
      });
    });
  });
  describe('Single Cart Details', () => {
    it('should handle non-numeric IDs well: expect 404', (done) => {
      request(`${url}/cart/bla`, (error, res) => {
        expect(res.statusCode).to.equal(404);
        done();
      });
    });

    [10, 45, 1000, 8, 4, 50000, 1, 3, 87, 1010, 7733].forEach((id) => {
      it(`should correctly display message for integer ID: ${id}`, (done) => {
        request(`${url}/cart/${id}`, (error, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.not.be.an('undefined');
          expect(res.body).to.equal(`Payment methods for cart ${id}`);
          done();
        });
      });
    });

    it('should handle alphanumeric values correctly: expect 404', (done) => {
      request(`${url}/cart/sev78in`, (error, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.equal('Not found');
        done();
      });
    });

    it('should correctly handle floating point numbers: expect 404', (done) => {
      request(`${url}/cart/78.5`, (error, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.equal('Not found');
        done();
      });
    });
  });

  describe('Available Payments', () => {
    it('correctly returns payment methods', (done) => {
      request(`${url}/available_payments`, (error, res) => {
        expect(res.statusCode).to.equal(200);
        done();
      });
    });

    it('rejects requests to undefined HTTP methods', (done) => {
      request(`${url}/available_payments`, { method: 'POST' }, (error, res) => {
        expect(res.statusCode).to.equal(404);
        done();
      });
    });
  });

  describe('Login', () => {
    it('should correctly log in a valid user', (done) => {
      const options = {
        method: 'POST',
        url: `${url}/login`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: 'Betty',
        }),
      };
      request(options, (error, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.equal('Welcome Betty');
        done();
      });
    });

    it('should fail without login credentials', (done) => {
      request.post(`${url}/login`, (error, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.equal('Invalid credentials');
        done();
      });
    });

    it('should fail when no username is provided', (done) => {
      request.post(`${url}/login`, { json: {} }, (error, res) => {
        expect(res.statusCode).equal(401);
        expect(res.body).to.equal('Invalid credentials');
        done();
      });
    });
  });
});
