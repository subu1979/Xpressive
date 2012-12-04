// modified version of code from the strophe plug-in 
// added classes to elements
// TODO: forms look untidy - need to make into 2 columns.

var $field, $form, $item, $opt, Field, Form, Item, Option, helper,
  __slice = [].slice,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

helper = {
  fill: function(src, target, klass) {
    var f, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = src.length; _i < _len; _i++) {
      f = src[_i];
      _results.push(target.push(f instanceof klass ? f : new klass(f)));
    }
    return _results;
  },
  createHtmlFieldCouple: function(f) {
    var tr, id, xclass, td1, td2;
    tr = $("<tr>"); 
    id = "Strophe-x-Field-" + f.type + "-" + f["var"].replace(/#/g, "-");
    xclass = " class='Field-" + f.type + "' ";
    td1 = $("<td>").append("<label" + xclass + "for='" + id + "'>" + f.label + "</label>")
    td2 = $("<td>").append($(f.toHTML()).attr("id", id));
    tr.append(td1).append(td2);
    return tr;
  },
  getHtmlFields: function(html) {
    html = $(html);
    return __slice.call(html.find("input")).concat(__slice.call(html.find("select")), __slice.call(html.find("textarea")));
  }
};

Form = (function() {

  Form._types = ["form", "submit", "cancel", "result"];

  function Form(opt) {
    this.toHTML = __bind(this.toHTML, this);

    this.toJSON = __bind(this.toJSON, this);

    this.toXML = __bind(this.toXML, this);

    var f, i, _i, _j, _len, _len1, _ref, _ref1, _ref2, _ref3;
    this.fields = [];
    this.items = [];
    this.reported = [];
    if (opt) {
      if (_ref = opt.type, __indexOf.call(Form._types, _ref) >= 0) {
        this.type = opt.type;
      }
      this.title = opt.title;
      this.instructions = opt.instructions;
      helper.fill = function(src, target, klass) {
        var f, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = src.length; _i < _len; _i++) {
          f = src[_i];
          _results.push(target.push(f instanceof klass ? f : new klass(f)));
        }
        return _results;
      };
      if (opt.fields) {
        if (opt.fields) {
          helper.fill(opt.fields, this.fields, Field);
        }
      } else if (opt.items) {
        if (opt.items) {
          helper.fill(opt.items, this.items, Item);
        }
        _ref1 = this.items;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          i = _ref1[_i];
          _ref2 = i.fields;
          for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
            f = _ref2[_j];
            if (!(_ref3 = f["var"], __indexOf.call(this.reported, _ref3) >= 0)) {
              this.reported.push(f["var"]);
            }
          }
        }
      }
    }
  }

  Form.prototype.type = "form";

  Form.prototype.title = null;

  Form.prototype.instructions = null;

  Form.prototype.toXML = function() {
    var f, i, r, xml, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    xml = $build("x", {
      xmlns: "jabber:x:data",
      type: this.type
    });
    if (this.title) {
      xml.c("title").t(this.title.toString()).up();
    }
    if (this.instructions) {
      xml.c("instructions").t(this.instructions.toString()).up();
    }
    if (this.fields.length > 0) {
      _ref = this.fields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        xml.cnode(f.toXML()).up();
      }
    } else if (this.items.length > 0) {
      xml.c("reported");
      _ref1 = this.reported;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        r = _ref1[_j];
        xml.c("field", {
          "var": r
        }).up();
      }
      xml.up();
      _ref2 = this.items;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        i = _ref2[_k];
        xml.cnode(i.toXML()).up();
      }
    }
    return xml.tree();
  };

  Form.prototype.toJSON = function() {
    var f, i, json, _i, _j, _len, _len1, _ref, _ref1;
    json = {
      type: this.type
    };
    if (this.title) {
      json.title = this.title;
    }
    if (this.instructions) {
      json.instructions = this.instructions;
    }
    if (this.fields.length > 0) {
      json.fields = [];
      _ref = this.fields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        json.fields.push(f.toJSON());
      }
    } else if (this.items.length > 0) {
      json.items = [];
      json.reported = this.reported;
      _ref1 = this.items;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        i = _ref1[_j];
        json.items.push(i.toJSON());
      }
    }
    return json;
  };

  Form.prototype.toHTML = function() {
    var f, form, i, _i, _j, _len, _len1, _ref, _ref1;
    form = $("<form class='x-form' data-type='" + this.type + "'>");
    if (this.title) {
      form.append("<h1 class='x-title'>" + this.title + "</h1>");
    }
    if (this.instructions) {
      form.append("<p class='x-instructions'>" + this.instructions + "</p>");
    }
    table = $("<table>");
    table.appendTo(form);
    if (this.fields.length > 0) {
      _ref = this.fields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        (helper.createHtmlFieldCouple(f)).appendTo(table);
      }
    } else if (this.items.length > 0) {
      _ref1 = this.items;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        i = _ref1[_j];
        ($(i.toHTML())).appendTo(form);
      }
    }
    return form[0];
  };

  Form.fromXML = function(xml) {
    var f, fields, i, instr, items, j, r, reported, title;
    xml = $(xml);
    f = new Form({
      type: xml.attr("type")
    });
    title = xml.find("title");
    if (title.length === 1) {
      f.title = title.text();
    }
    instr = xml.find("instructions");
    if (instr.length === 1) {
      f.instructions = instr.text();
    }
    fields = xml.find("field");
    items = xml.find("item");
    if (items.length > 0) {
      f.items = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          i = items[_i];
          _results.push(Item.fromXML(i));
        }
        return _results;
      })();
    } else if (fields.length > 0) {
      f.fields = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          j = fields[_i];
          _results.push(Field.fromXML(j));
        }
        return _results;
      })();
    }
    reported = xml.find("reported");
    if (reported.length === 1) {
      fields = reported.find("field");
      f.reported = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          r = fields[_i];
          _results.push(($(r)).attr("var"));
        }
        return _results;
      })();
    }
    return f;
  };

  Form.fromHTML = function(html) {
    var f, field, fields, i, instructions, item, items, j, title, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    html = $(html);
    f = new Form({
      type: html.attr("data-type")
    });
    title = html.find("h1").text();
    if (title) {
      f.title = title;
    }
    instructions = html.find("p").text();
    if (instructions) {
      f.instructions = instructions;
    }
    items = html.find("fieldset");
    fields = helper.getHtmlFields(html);
    if (items.length > 0) {
      f.items = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = items.length; _i < _len; _i++) {
          i = items[_i];
          _results.push(Item.fromHTML(i));
        }
        return _results;
      })();
      _ref = f.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        _ref1 = item.fields;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          field = _ref1[_j];
          if (!(_ref2 = field["var"], __indexOf.call(f.reported, _ref2) >= 0)) {
            f.reported.push(field["var"]);
          }
        }
      }
    } else if (fields.length > 0) {
      f.fields = (function() {
        var _k, _len2, _results;
        _results = [];
        for (_k = 0, _len2 = fields.length; _k < _len2; _k++) {
          j = fields[_k];
          _results.push(Field.fromHTML(j));
        }
        return _results;
      })();
    }
    return f;
  };

  return Form;

})();

Field = (function() {

  Field._types = ["boolean", "fixed", "hidden", "jid-multi", "jid-single", "list-multi", "list-single", "text-multi", "text-private", "text-single"];

  Field._multiTypes = ["list-multi", "jid-multi", "text-multi", "hidden"];

  function Field(opt) {
    this.toHTML = __bind(this.toHTML, this);

    this.toXML = __bind(this.toXML, this);

    this.toJSON = __bind(this.toJSON, this);

    this.addOptions = __bind(this.addOptions, this);

    this.addOption = __bind(this.addOption, this);

    this.addValues = __bind(this.addValues, this);

    this.addValue = __bind(this.addValue, this);

    var _ref, _ref1;
    this.options = [];
    this.values = [];
    if (opt) {
      if (_ref = opt.type, __indexOf.call(Field._types, _ref) >= 0) {
        this.type = opt.type.toString();
      }
      if (opt.desc) {
        this.desc = opt.desc.toString();
      }
      if (opt.label) {
        this.label = opt.label.toString();
      }
      this["var"] = ((_ref1 = opt["var"]) != null ? _ref1.toString() : void 0) || "_no_var_was_defined_";
      this.required = opt.required === true || opt.required === "true";
      if (opt.options) {
        this.addOptions(opt.options);
      }
      if (opt.value) {
        opt.values = [opt.value];
      }
      if (opt.values) {
        this.addValues(opt.values);
      }
    }
  }

  Field.prototype.type = "text-single";

  Field.prototype.desc = null;

  Field.prototype.label = null;

  Field.prototype["var"] = "_no_var_was_defined_";

  Field.prototype.required = false;

  Field.prototype.addValue = function(val) {
    return this.addValues([val]);
  };

  Field.prototype.addValues = function(vals) {
    var multi, v, _ref;
    multi = (_ref = this.type, __indexOf.call(Field._multiTypes, _ref) >= 0);
    if (multi || (!multi && vals.length === 1)) {
      this.values = __slice.call(this.values).concat(__slice.call((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = vals.length; _i < _len; _i++) {
            v = vals[_i];
            _results.push(v.toString());
          }
          return _results;
        })()));
    }
    return this;
  };

  Field.prototype.addOption = function(opt) {
    return this.addOptions([opt]);
  };

  Field.prototype.addOptions = function(opts) {
    var o;
    if (this.type === "list-single" || this.type === "list-multi") {
      if (typeof opts[0] !== "object") {
        opts = (function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = opts.length; _i < _len; _i++) {
            o = opts[_i];
            _results.push(new Option({
              value: o.toString()
            }));
          }
          return _results;
        })();
      }
      helper.fill(opts, this.options, Option);
    }
    return this;
  };

  Field.prototype.toJSON = function() {
    var json, o, _i, _len, _ref;
    json = {
      type: this.type,
      "var": this["var"],
      required: this.required
    };
    if (this.desc) {
      json.desc = this.desc;
    }
    if (this.label) {
      json.label = this.label;
    }
    if (this.values) {
      json.values = this.values;
    }
    if (this.options) {
      json.options = [];
      _ref = this.options;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        o = _ref[_i];
        json.options.push(o.toJSON());
      }
    }
    return json;
  };

  Field.prototype.toXML = function() {
    var attrs, o, v, xml, _i, _j, _len, _len1, _ref, _ref1;
    attrs = {
      type: this.type,
      "var": this["var"]
    };
    if (this.label) {
      attrs.label = this.label;
    }
    xml = $build("field", attrs);
    if (this.desc) {
      xml.c("desc").t(this.desc).up();
    }
    if (this.required) {
      xml.c("required").up();
    }
    if (this.values) {
      _ref = this.values;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        xml.c("value").t(v.toString()).up();
      }
    }
    if (this.options) {
      _ref1 = this.options;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        o = _ref1[_j];
        xml.cnode(o.toXML()).up();
      }
    }
    return xml.tree();
  };

  Field.prototype.toHTML = function() {
    var el, k, line, o, opt, txt, val, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    var xclass = "Field-" + this.type.toLowerCase();
    var fieldType = this.type.toLowerCase();
    
    switch (fieldType) {
      case 'list-single':
      case 'list-multi':
        el = $("<select>");
        if (this.type === 'list-multi') {
          el.attr('multiple', 'multiple');
        }
        if (this.options.length > 0) {
          _ref = this.options;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            opt = _ref[_i];
            if (!(opt)) {
              continue;
            }
            o = $(opt.toHTML());
            _ref1 = this.values;
            for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
              k = _ref1[_j];
              if (k.toString() === opt.value.toString()) {
                o.attr('selected', 'selected');
              }
            }
            o.appendTo(el);
          }
        }
        break;
      case 'text-multi':
      case 'jid-multi':
        el = $("<textarea>");
        txt = ((function() {
          var _k, _len2, _ref2, _results;
          _ref2 = this.values;
          _results = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            line = _ref2[_k];
            _results.push(line);
          }
          return _results;
        }).call(this)).join('\n');
        if (txt) {
          el.text(txt);
        }
        break;
      case 'boolean':
        el = $("<select>");
        el.attr('boolean', 'boolean');
        o1 = ($("<option class='Field-option'>")).attr('value', "1").text("Yes");
        o2 = ($("<option class='Field-option'>")).attr('value', "0").text("No");
		if (this.values[0] && (this.values[0] === "1" || this.values[0] === "true")) {
	        o1.attr('selected', 'selected');
        } else {
        	o2.attr('selected', 'selected');
        }
        o1.appendTo(el);
        o2.appendTo(el);
        break;      
      case 'text-single':
      case 'text-private':
      case 'hidden':
      case 'fixed':
      case 'jid-single':
        el = $("<input>");
        if (this.values && fieldType !== 'boolean') {
          el.val(this.values[0]);
        }
        switch (this.type.toLowerCase()) {
          case 'text-single':
            el.attr('type', 'text');
            el.attr('placeholder', this.desc);
            break;
          case 'boolean':
            el.attr('type', 'checkbox');
            val = (_ref2 = this.values[0]) != null ? typeof _ref2.toString === "function" ? _ref2.toString() : void 0 : void 0;
            if (this.values[0] && (this.values[0] === "true" || this.values[0] === "1")) {
              el.attr('checked', 'checked');
            }
            break;
          case 'text-private':
            el.attr('type', 'password');
            break;
          case 'hidden':
            el.attr('type', 'hidden');
            break;
          case 'fixed':
            el.attr('type', 'text').attr('readonly', 'readonly');
            break;
          case 'jid-single':
            el.attr('type', 'email');
        }
        break;
      default:
        el = $("<input type='text'>");
    }
    el.addClass(xclass);
    el.attr('name', this["var"]);
    if (this.required) {
      el.attr('required', this.required);
    }
    return el[0];
  };

  Field.fromXML = function(xml) {
    var o, v;
    xml = $(xml);
    return new Field({
      type: xml.attr("type"),
      "var": xml.attr("var"),
      label: xml.attr("label"),
      desc: xml.find("desc").text(),
      required: xml.find("required").length === 1,
      values: (function() {
        var _i, _len, _ref, _results;
        _ref = xml.find("field > value");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          v = _ref[_i];
          _results.push(($(v)).text());
        }
        return _results;
      })(),
      options: (function() {
        var _i, _len, _ref, _results;
        _ref = xml.find("option");
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          o = _ref[_i];
          _results.push(Option.fromXML(o));
        }
        return _results;
      })()
    });
  };

  Field._htmlElementToFieldType = function(el) {
    var r, type;
    el = $(el);
    switch (el[0].nodeName.toLowerCase()) {
      case "textarea":
        type = "text-multi";
        break;
      case "select":
      	if (el.attr("boolean")) {
      		type = "boolean";
      	} else if (el.attr("multiple") === "multiple") {
          type = "list-multi";
        } else {
          type = "list-single";
        }
        break;
      case "input":
        switch (el.attr("type")) {
          case "email":
            type = "jid-single";
            break;
          case "hidden":
            type = "hidden";
            break;
          case "password":
            type = "text-private";
            break;
          case "text":
            r = el.attr("readonly") === "readonly";
            if (r) {
              type = "fixed";
            } else {
              type = "text-single";
            }
        }
    }
    return type;
  };

  Field.fromHTML = function(html) {
    var el, f, txt, type;
    html = $(html);
    type = Field._htmlElementToFieldType(html);
    f = new Field({
      type: type,
      "var": html.attr("name"),
      required: html.attr("required") === "required"
    });
    switch (type) {
      case "list-multi":
      case "list-single":
      case "boolean":  // NOTE: booleans are shown as a (single value list) <select> of Yes & No.
        f.values = (function() {
          var _i, _len, _ref, _results;
          _ref = html.find("option:selected");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            el = _ref[_i];
            _results.push(($(el)).val());
          }
          return _results;
        })();
        f.options = (function() {
          var _i, _len, _ref, _results;
          _ref = html.find("option");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            el = _ref[_i];
            _results.push(Option.fromHTML(el));
          }
          return _results;
        })();
        break;
      case "text-multi":
      case "jid-multi":
        txt = html.text();
        if (txt.trim() !== "") {
          f.values = txt.split('\n');
        }
        break;
      case 'text-single':
      case 'text-private':
      case 'hidden':
      case 'fixed':
      case 'jid-single':
        if (html.val().trim() !== "") {
          f.values = [ html.val() ];
        }
    }
    return f;
  };

  return Field;

})();

Option = (function() {

  function Option(opt) {
    this.toHTML = __bind(this.toHTML, this);

    this.toJSON = __bind(this.toJSON, this);

    this.toXML = __bind(this.toXML, this);
    if (opt) {
      if (opt.label) {
        this.label = opt.label.toString();
      }
      if (opt.value) {
        this.value = opt.value.toString();
      }
    }
  }

  Option.prototype.label = "";

  Option.prototype.value = "";

  Option.prototype.toXML = function() {
    return ($build("option", {
      label: this.label
    })).c("value").t(this.value.toString()).tree();
  };

  Option.prototype.toJSON = function() {
    return {
      label: this.label,
      value: this.value
    };
  };

  Option.prototype.toHTML = function() {
    return ($("<option class='Field-option'>")).attr('value', this.value).text(this.label || this.value)[0];
  };

  Option.fromXML = function(xml) {
    return new Option({
      label: ($(xml)).attr("label"),
      value: ($(xml)).text()
    });
  };

  Option.fromHTML = function(html) {
    return new Option({
      value: ($(html)).attr("value"),
      label: ($(html)).text()
    });
  };

  return Option;

})();

Item = (function() {

  function Item(opts) {
    this.toHTML = __bind(this.toHTML, this);

    this.toJSON = __bind(this.toJSON, this);

    this.toXML = __bind(this.toXML, this);
    this.fields = [];
    if (opts != null ? opts.fields : void 0) {
      helper.fill(opts.fields, this.fields, Field);
    }
  }

  Item.prototype.toXML = function() {
    var f, xml, _i, _len, _ref;
    xml = $build("item");
    _ref = this.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      f = _ref[_i];
      xml.cnode(f.toXML()).up();
    }
    return xml.tree();
  };

  Item.prototype.toJSON = function() {
    var f, json, _i, _len, _ref;
    json = {};
    if (this.fields) {
      json.fields = [];
      _ref = this.fields;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        f = _ref[_i];
        json.fields.push(f.toJSON());
      }
    }
    return json;
  };

  Item.prototype.toHTML = function() {
    var f, fieldset, _i, _len, _ref;
    fieldset = $("<fieldset class='Field-item'>");
    _ref = this.fields;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      f = _ref[_i];
      (helper.createHtmlFieldCouple(f)).appendTo(fieldset);
    }
    return fieldset[0];
  };

  Item.fromXML = function(xml) {
    var f, fields;
    xml = $(xml);
    fields = xml.find("field");
    return new Item({
      fields: (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = fields.length; _i < _len; _i++) {
          f = fields[_i];
          _results.push(Field.fromXML(f));
        }
        return _results;
      })()
    });
  };

  Item.fromHTML = function(html) {
    var f;
    return new Item({
      fields: (function() {
        var _i, _len, _ref, _results;
        _ref = helper.getHtmlFields(html);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          f = _ref[_i];
          _results.push(Field.fromHTML(f));
        }
        return _results;
      })()
    });
  };

  return Item;

})();

Strophe.x = {
  Form: Form,
  Field: Field,
  Option: Option,
  Item: Item
};

$form = function(opt) {
  return new Strophe.x.Form(opt);
};

$field = function(opt) {
  return new Strophe.x.Field(opt);
};

$opt = function(opt) {
  return new Strophe.x.Option(opt);
};

$item = function(opts) {
  return new Strophe.x.Item(opts);
};

Strophe.addConnectionPlugin('x', {
  init: function(conn) {
    Strophe.addNamespace('DATA', 'jabber:x:data');
    if (conn.disco) {
      return conn.disco.addFeature(Strophe.NS.DATA);
    }
  },
  parseFromResult: function(result) {
    var _ref;
    if (result.nodeName.toLowerCase() === "x") {
      return Form.fromXML(result);
    } else {
      return Form.fromXML((_ref = ($(result)).find("x")) != null ? _ref[0] : void 0);
    }
  }
});
