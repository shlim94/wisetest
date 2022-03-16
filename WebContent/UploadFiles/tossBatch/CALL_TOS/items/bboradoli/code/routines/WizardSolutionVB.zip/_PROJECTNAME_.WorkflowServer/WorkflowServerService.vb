red = new _deferred.Deferred;
                        clearTimeout(that._valueChangeTimeout);
                        that._valueChangeDeferred.done(function() {
                            this.option("searchValue", e.value)
                        }.bind(that));
                        if (e.event && "input" === e.event.type && searchTimeout) {
                            that._valueChangeTimeout = setTimeout(function() {
                                that._valueChangeDeferred.resolve()
                            }, searchTimeout)
                        } else {
                            that._valueChangeDeferred.resolve()
                        }
                    }
                }, userEditorOptions)
            },
            _getAriaTarget: function() {
                if (this.option("searchEnabled")) {
                    return this._itemContainer(true)
                }
                return this.$element()
            },
            _focusTarget: function() {
                if (this.option("searchEnabled")) {
                    return this._itemContainer(true)
                }
                return this.callBase()
            },
            _updateFocusState: function(e, isFocused) {
                if (this.option("searchEnabled")) {
                    this._toggleFocusClass(isFocused, this.$element())
                }
                this.callBase(e, isFocused)
            },
            getOperationBySearchMode: function(searchMode) {
                return "equals" === searchMode ? "=" : searchMode
            },
            _cleanAria: function($target) {
                this.setAria({
                    role: null,
                    activedescendant: null
                }, $target);
                $target.attr("tabIndex", null)
            },
            _optionChanged: function(args) {
                switch (args.name) {
                    case "searchEnabled":
                    case "searchEditorOptions":
                        this._cleanAria(this.option("searchEnabled") ? this.$element() : this._itemContainer());
                        this._invalidate();
                        break;
                    case "searchExpr":
                    case "searchMode":
                    case "searchValue":
                        if (!this._dataSource) {
                            _ui2.default.log("W1009");
                            return
                        }
                        if ("searchMode" === args.name) {
                            this._dataSource.searchOperation(this.getOperationBySearchMode(args.value))
                        } else {
                            this._dataSource[args.name](args.value)
                        }
                        this._dataSource.load();
                        break;
                    case "searchTimeout":
                        break;
                    default:
                        this.callBase(args)
                }
            },
            focus: function() {
                if (!this.option("focusedElement") && this.option("searchEnabled")) {
                    this._searchEditor && this._searc