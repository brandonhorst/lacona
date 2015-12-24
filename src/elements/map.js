import _ from 'lodash'
import { Phrase } from 'lacona-phrase'
import { reconcile } from '../reconcile'
import { parse } from '../parse'

function hasPlaceholder(output) {
  return _.any(output.words, 'placeholder')
}

export class MapPhrase extends Phrase {
  static defaultProps = {
    function: _.identity
  };

  * _handleParse (input, options) {
    if (this.props.children && this.props.children.length > 0) {
      this.childPhrase = reconcile({descriptor: this.props.children[0], phrase: this.childPhrase, options})

      for (let output of parse({phrase: this.childPhrase, input, options})) {
        if (hasPlaceholder(output)) {
          yield output
        } else {
          const newResult = this.props.function(output.result)
          const modifications = {result: newResult}
          yield _.assign({}, output, modifications)
        }
      }
    }
  }
}
