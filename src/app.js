import angular from 'angular'
import is from 'is_js'
import style from './style.css'

const opIndex = {
  '+': (a, b) => (a + b),
  '-': (a, b) => (a - b),
  'x': (a, b) => (a * b),
  '÷': (a, b) => (a / b)
}

angular.module('App', [])
  .component('appComponent', {
    template: `
      <div class='${style.container}'>
        <div class='${style.calculator}'>
          <div class='${style.result}'>
            {{$ctrl.result}}
          </div>
          <div class='${style.memorybuttons}'>
            <div ng-repeat="key in $ctrl.memoryKeys track by $index">
              <button ng-click='$ctrl.click(key)'>{{key}}</button>
            </div>
          </div>
          <div class='${style.buttons}'>
            <div ng-repeat="key in $ctrl.keys track by $index">
              <button ng-click='$ctrl.click(key)'>{{key}}</button>
            </div>
          </div>
        </div>
      </div>
    `,
    controller: function () {
      this.keys = ['CE', 'C', '<', '÷', 7, 8, 9, 'x', 4, 5, 6, '-', 1, 2, 3, '+', '', 0, '.', '=']
      this.memoryKeys = ['MC', 'MR', 'M+', 'M-', 'MS']
      this.result = '0'
      this.prev = '0'
      this.mem = '0'
      this.clear = false
      this.action = null

      this.click = (e) => {
        if (this.prev && this.result && this.action && e === '=') {
          this.result = opIndex[this.action](parseFloat(this.prev), parseFloat(this.result)) + ''
          this.prev = '0'
          this.action = null
          this.clear = true
        } else if (is.number(e)) {
          this.result = (this.clear ? e + '' : this.result + e).replace(/^(0)(\d)/, '$2')
          if (this.clear) {
            this.clear = false
          }
        } else if (!is.number(e) && ['÷', 'x', '-', '+'].indexOf(e) !== -1) {
          this.prev = this.result
          this.clear = true
          this.action = e
        } else if (e === '.') {
          this.result = this.result + '.'
        } else if (e === '<') {
          this.result = this.result.slice(0, -1) || '0'
        } else if (e === 'CE') {
          this.result = '0'
        } else if (e === 'C') {
          this.result = '0'
          this.prev = '0'
          this.action = null
          this.clear = false
        } else if (e === 'MC') {
          this.mem = '0'
        } else if (e === 'MS') {
          this.mem = this.result
        } else if (e === 'MR') {
          this.result = this.mem
        } else if (e === 'M+') {
          this.mem = opIndex['+'](parseFloat(this.mem), parseFloat(this.result)) + ''
        } else if (e === 'M-') {
          this.mem = opIndex['-'](parseFloat(this.mem), parseFloat(this.result)) + ''
        }
      }
    }
  })

angular.bootstrap(document, ['App'])
