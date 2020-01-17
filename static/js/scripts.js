const createQuiz = {
  addQuestion: element => {
    const index = Array.from(element.parentNode.children).indexOf(element);
    const questionMarkup = `
    <div class="question-container card four-children">
      <div class="input-container bottom">
        <div>
          <label for="question">Question</label>
          <input type="text" name="question[]" class="text-input question" placeholder="Enter a question" required>
        </div>
        <i class="fas fa-trash-alt" onclick="createQuiz.deleteQuestion(this)"></i>
      </div>
      <div class="options-container">
        <div class="option-container">
          <div class="input-container bottom">
            <div>
              <label for="option">Option</label>
              <input type="text" name="option[${index}][]" class="text-input option" placeholder="Option" required>
            </div>
            <input type="checkbox" name="answer[${index}][]" class="checkbox-input" value="0">
            <i class="fas fa-trash-alt" onclick="createQuiz.deleteOption(this)"></i>
          </div>
        </div>
        <div class="option-container">
          <div class="input-container bottom">
            <div>
              <label for="option">Option</label>
              <input type="text" name="option[${index}][]" class="text-input option" placeholder="Option" required>
            </div>
            <input type="checkbox" name="answer[${index}][]" class="checkbox-input" value="1">
            <i class="fas fa-trash-alt" onclick="createQuiz.deleteOption(this)"></i>
          </div>
        </div>
        <div class="option-container">
          <div class="input-container bottom">
            <div>
              <label for="option">Option</label>
              <input type="text" name="option[${index}][]" class="text-input option" placeholder="Option" required>
            </div>
            <input type="checkbox" name="answer[${index}][]" class="checkbox-input" value="2">
            <i class="fas fa-trash-alt" onclick="createQuiz.deleteOption(this)"></i>
          </div>
        </div>
        <div class="add-option-btn">
          <button type="button" name="addOption" onclick="createQuiz.addOption(this, ${index})"><i class="fas fa-plus"></i> Add option</button>
        </div>
      </div>
    </div>
  `;
  return element.insertAdjacentHTML('beforebegin', questionMarkup)
  },
  addOption: (element, questionIndex) => {
    const questionContainer = element.closest('.question-container');
    const optionsContainer = element.closest('.options-container');
    const optionsContainerChildren = optionsContainer.childElementCount + 1;
    optionsContainerChildren == 5 ? questionContainer.classList.remove('four-children') : null;
    
    const index = Array.from(element.closest('.options-container').children).indexOf(element.parentNode);
    const optionMarkup = `
    <div class="option-container">
      <div class="input-container bottom">
        <div>
          <label for="option">Option</label>
          <input type="text" name="option[${questionIndex}][]" class="text-input option" placeholder="Option" required>
        </div>
        <input type="checkbox" name="answer[${questionIndex}][]" class="checkbox-input" value="${index}">
        <i class="fas fa-trash-alt" onclick="createQuiz.deleteOption(this)"></i>
      </div>
    </div>
  `;
  return element ? element.parentNode.insertAdjacentHTML('beforebegin', optionMarkup) : optionMarkup
  
  },
  deleteQuestion: deleteButton => {
    const questionsContainer = deleteButton.closest('.questions-container');

    deleteButton.closest('.question-container').remove();

    const questionsContainerChildren = [ ...questionsContainer.childNodes ]
    let index = 0;

    for(const element of questionsContainerChildren) {
      if(element.classList && element.classList.contains('question-container')) {
        for(const inputField of element.querySelectorAll('.text-input.option, .checkbox-input')) {
          inputField.type === 'text' ? inputField.name = `option[${index}][]` : inputField.name = `answer[${index}][]`
        }
        index++
      }
    }
  },
  deleteOption: deleteButton => {
    const questionContainer = deleteButton.closest('.question-container');
    const optionsContainer = deleteButton.closest('.options-container');
    const optionsContainerChildrenCount = optionsContainer.childElementCount - 1;
    optionsContainerChildrenCount == 4 ? questionContainer.classList.add('four-children') : null;
    
    deleteButton.closest('.option-container').remove();
    
    const optionsContainerChildren = [ ...optionsContainer.childNodes ]
    let index = 0;

    for(const element of optionsContainerChildren) {
      if(element.className === 'option-container') {
        element.getElementsByClassName('checkbox-input')[0].value = index
        index++
      }
    }
  }
}