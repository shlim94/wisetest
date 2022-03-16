(event) {
            self.tabChanged($(event.currentTarget).attr('title'));
        });
        return div;
    };
    var editorTypeMapping = {
        fill: FillColorEditor,
        border: BorderEditor,
        markerOptions: MarkerEditor,
        trendlineOptions: TrendlineOptionEditor,
        radioEx: RadioGroupEx,
        series: SeriesEditor,
        line: LineEditor,
        size: SizeEditor,
        textFill: TextFillEditor,
        legend: LegendPositionEditor,
        font: FontEditor,
        tick: TickEditor,
        format: FormatEditor,
        axisValue: AxisValueEditor,
        axisCategory: AxisCategoryEditor,
        textElement: TextElementEditor,
        seriesErrorBar: ErrorBarEditor
    };
    //#region sliderPanel DataManager
    function PropertyTabPanel(datas, owner) { // [{name:"fillAndLine", icon:'', properties:[{name: 'Fill', data: "red", type: "fillEditor"}, {name: 'Border', data: {}, type: 'border'}]}]}, {name:"seriesOptions", icon: '', properties: [{name: "seriesOptions", data: primary, type: 'seriesOptions']
        var self = this;
        this.owner = owner;
        this.propertyHeaderData = [];
        this.propertyGroupPanels = [];
        var tabPanel = $('<div></div>');
        for (var i = 0; i < datas.length; i++) {
            this.propertyHeaderData.push({ name: datas[i].name/*, icon: datas[i].icon*/ });
        }
        this.propertyHeaderPanel = new PropertyTabHeader(tabPanel, this.propertyHeaderData, function (name) {
            self.activeTabChanged(name);
        });
        self.groupPanelArray = [];

        for (var j = 0; j < datas.length; j++) {
            var GroupPanelItem = new PropertyGroupPanels(datas[j].name, datas[j].properties, function (namePath, dataPath, propertyName, value) {
                return self.activePanelValueChanged(namePath, dataPath, propertyName, value);
            });
            self.groupPanelArray.push(GroupPanelItem);
            var groupPanel = GroupPanelItem.div;
            tabPanel.append(groupPanel);
            this.propertyGroupPanels.push({ name: datas[j].name, propertyGroupPanel: groupPanel });
        }
        this.activePropertyGroupPanel = this.propertyGroupPanels[0].propertyGroupPanel;
        this.showPropertyGroupPanel(this.activePropertyGroupPanel);
        self.dom = tabPanel;
    }

    PropertyTabPanel.prototype.activePanelValueChanged = function (namePath, dataPath, propertyName, value) {
        return this.owner.updateData(namePath, dataPath, propertyName, value);
    };
    PropertyTabPanel.prototype.activeTabChanged = function (name) {
        for (var i = 0; i < this.propertyGroupPanels.length; i++) {
            if (this.propertyGroupPanels[i].name === name) {
                this.hidePropertyGroupPanel(this.activePropertyGroupPanel