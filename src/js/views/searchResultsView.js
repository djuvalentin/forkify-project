import View from './View.js';
import PreviewView from './previewView.js';
class SearchResultsView extends View {
  _parentContainer = document.querySelector('.results');
  _errorMessage = '💥 Unable to load recipe results';

  _generateMarkup() {
    return this._data
      .map(previewData => PreviewView.render(previewData, false))
      .join('');
  }
}

export default new SearchResultsView();
