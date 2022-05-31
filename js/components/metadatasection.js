class MetadataSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<section class="section is-hidden" id="metadata-section">
    <div class="notification is-link is-light is-hidden-desktop">
      <h1 class="title is-4" i18n="mobile-metadata"></h1>
      <p i18n="mobile-metadata-hint"></p>
    </div>
    <div class="is-desktop is-centered" id="details-panel">
      <div class="column">
        <div class="box has-sidebar has-no-background has-no-shadow">
          <nav class="sidebar">
            <ul class="sidebar-options">
              <li
                class="sidebar-option is-activable is-active"
                id="foundational-option"
                onclick="sidebarOptionClicked(event)"
              >
                <i class="fa-solid fa-pen"></i>
                <span i18n="foundational"></span>
              </li>
              <li
                class="sidebar-option is-activable"
                id="extended-option"
                onclick="sidebarOptionClicked(event)"
              >
                <i class="fa-solid fa-gear"></i>
                <span i18n="extended"></span>
              </li>
              <li
                class="sidebar-option is-activable"
                id="duplicate-option"
                onclick="sidebarOptionClicked(event)"
              >
                <i class="fa-solid fa-clone"></i>
                <span i18n="duplicate"></span>
              </li>
              <li
                class="sidebar-option"
                id="remove-button"
                onclick="showRemoveModal()"
              >
                <i class="fa-solid fa-trash"></i>
                <span i18n="remove"></span>
              </li>
              <li
                class="sidebar-option"
                id="save-button"
                onclick="saveElement()"
              >
                <i class="fa-solid fa-check"></i>
                <span i18n="save"></span>
              </li>
            </ul>
          </nav>
          <div class="box-content is-flex-direction-row" id="foundational-options">
            <div>
              <div class="field detail-field">
                <label class="label" id="element-oid-label"></label>
                <input
                  class="input"
                  type="text"
                  id="id-input"
                  autocomplete="off"
                />
              </div>
              <div class="field detail-field">
                <label
                  class="label"
                  id="datatype-label"
                  i18n="data-type"
                ></label>
              </div>
              <div class="field detail-field">
                <label
                  class="label"
                  id="mandatory-label"
                  i18n="mandatory"
                ></label>
              </div>
              <div class="is-flex is-flex-direction-column"></div>
              <div class="field detail-field">
                <label
                  class="label"
                  id="element-name-label"
                  i18n="name"
                ></label>
                <input
                  class="input"
                  type="text"
                  id="name-input"
                  autocomplete="off"
                />
              </div>
            </div>
            <div
              class="field detail-field is-flex is-flex-direction-column is-flex-grow-1"
            >
              <label class="label" id="element-long-label"></label>
              <textarea
                class="textarea is-flex-grow-1"
                id="translation-textarea"
              ></textarea>
            </div>
          </div>

          <div class="box-content is-relative is-hidden" id="extended-options">
            <div class="columns">
              <div class="column" id="condition-alias-column">
                <div class="field detail-field">
                  <label class="label" i18n="collection-condition"></label>
                  <div class="control has-autocomplete-bottom">
                    <input
                      class="input"
                      type="text"
                      id="collection-condition"
                      autocomplete="off"
                      i18n-ph="formal-expression"
                    />
                  </div>
                </div>
                <div class="field detail-field">
                  <label
                    class="label is-inline-block"
                    i18n="alias-names"
                  ></label>
                  
                  <div id="alias-inputs"></div>
                  <button
                    class="button is-small is-fullwidth"
                    id="add-alias-button"
                    onclick="addEmptyAliasInput()"
                    i18n="add"
                  ></button>
                </div>
              </div>
              <div class="column" id="unit-range-column">
                <div class="field detail-field">
                  <label class="label" i18n="measurement-unit"></label>
                  <div class="control has-autocomplete-bottom">
                    <input
                      class="input"
                      type="text"
                      id="measurement-unit"
                      autocomplete="off"
                      i18n-ph="symbol"
                    />
                  </div>
                </div>
                <div class="field detail-field">
                  <label class="label" i18n="range-checks"></label>
                  <div id="range-check-inputs"></div>
                  <button
                    class="button is-small is-fullwidth"
                    id="add-range-check-button"
                    onclick="addEmptyRangeCheckInput()"
                    i18n="add"
                  ></button>
                </div>
              </div>
              <div class="column" id="calculation-column">
                <div class="field detail-field">
                  <label class="label" i18n="calculation"></label>
                  <div class="control has-autocomplete-bottom">
                    <input
                      class="input"
                      type="text"
                      id="item-method"
                      autocomplete="off"
                      i18n-ph="formal-expression"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="box-content is-hidden" id="duplicate-options">
            <div class="field detail-field" style="height: fit-content;">
              <label class="label" i18n="existing-references"></label>
              <div class="notification">
                <p id="element-references-hint"></p>
                <p
                  class="has-text-weight-bold is-hidden mt-3"
                  id="element-references-list"
                ></p>
              </div>
            </div>
            <div class="field detail-field" style="height: fit-content;">
              <label class="label" i18n="new-duplication"></label>
              <div class="buttons">
                <button
                  class="button is-small"
                  id="reference-button"
                  i18n="reference"
                  onclick="duplicateReference()"
                ></button>
                <button
                  class="button is-small"
                  id="shallow-copy-button"
                  i18n="shallow-copy"
                  onclick="copyElement(false)"
                ></button>
                <button
                  class="button is-small"
                  id="deep-copy-button"
                  i18n="deep-copy"
                  onclick="copyElement(true)"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="columns is-desktop">
      <div class="column">
        <nav class="panel is-link">
          <p class="panel-heading" i18n="events"></p>
          <div
            class="tree-panel-blocks"
            id="study-event-panel-blocks"
            ondragenter="allowDrop(event)"
            ondragover="allowDrop(event)"
            ondrop="elementDrop(event)"
          ></div>
          <div class="panel-block has-light-border-top">
            <button
              class="button is-link is-light is-fullwidth"
              id="study-events-add-button"
              onclick="addStudyEvent(event)"
              element-type="studyevent"
              ondragenter="allowDrop(event)"
              ondragover="allowDrop(event)"
              ondrop="elementDrop(event)"
              i18n="add"
            ></button>
          </div>
        </nav>
      </div>
      <div class="column">
        <nav class="panel is-link">
          <p class="panel-heading" i18n="forms"></p>
          <div
            class="tree-panel-blocks"
            id="form-panel-blocks"
            ondragenter="allowDrop(event)"
            ondragover="allowDrop(event)"
            ondrop="elementDrop(event)"
          ></div>
          <div class="panel-block has-light-border-top">
            <button
              class="button is-link is-light is-fullwidth"
              id="forms-add-button"
              onclick="addForm(event)"
              element-type="form"
              ondragenter="allowDrop(event)"
              ondragover="allowDrop(event)"
              ondrop="elementDrop(event)"
              i18n="add"
              disabled
            ></button>
          </div>
        </nav>
      </div>
      <div class="column">
        <nav class="panel is-link">
          <p class="panel-heading" i18n="groups"></p>
          <div
            class="tree-panel-blocks"
            id="item-group-panel-blocks"
            ondragenter="allowDrop(event)"
            ondragover="allowDrop(event)"
            ondrop="elementDrop(event)"
          ></div>
          <div class="panel-block has-light-border-top">
            <button
              class="button is-link is-light is-fullwidth"
              id="item-groups-add-button"
              onclick="addItemGroup(event)"
              element-type="itemgroup"
              ondragenter="allowDrop(event)"
              ondragover="allowDrop(event)"
              ondrop="elementDrop(event)"
              i18n="add"
              disabled
            ></button>
          </div>
        </nav>
      </div>
      <div class="column">
        <nav class="panel is-link">
          <p class="panel-heading" i18n="items"></p>
          <div
            class="tree-panel-blocks"
            id="item-panel-blocks"
            ondragenter="allowDrop(event)"
            ondragover="allowDrop(event)"
            ondrop="elementDrop(event)"
          ></div>
          <div class="panel-block has-light-border-top">
            <button
              class="button is-link is-light is-fullwidth"
              id="items-add-button"
              onclick="addItem(event)"
              element-type="item"
              ondragenter="allowDrop(event)"
              ondragover="allowDrop(event)"
              ondrop="elementDrop(event)"
              i18n="add"
              disabled
            ></button>
          </div>
        </nav>
      </div>
      <div class="column">
        <nav class="panel is-link">
          <p class="panel-heading" i18n="choices"></p>
          <div
            class="tree-panel-blocks"
            id="code-list-item-panel-blocks"
            ondragenter="allowDrop(event)"
            ondragover="allowDrop(event)"
            ondrop="elementDrop(event)"
          ></div>
          <div class="panel-block has-light-border-top">
            <div
              class="field is-grouped is-fullwidth"
              ondragenter="allowDrop(event)"
              ondragover="allowDrop(event)"
              ondrop="elementDrop(event)"
            >
              <div class="control is-expanded">
                <button
                  class="button is-link is-light is-fullwidth"
                  id="code-list-items-add-button"
                  onclick="addCodeListItem(event)"
                  element-type="codelistitem"
                  i18n="add"
                  disabled
                ></button>
              </div>
              <div class="control">
                <button
                  class="button is-white"
                  id="code-list-items-opt-button"
                  onclick="showCodeListModal()"
                  disabled
                >
                  <span class="icon">
                    <i class="fa-solid fa-bars"></i>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </section>`;
  }
}

window.customElements.define("metadata-section", MetadataSection);
