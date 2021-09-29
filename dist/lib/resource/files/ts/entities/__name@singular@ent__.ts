import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';

const <%= singular(classify(name)) %>_MODEL = '<%= singular(classify(name)) %>';
const <%= singular(classify(name)) %>Schema = new mongoose.Schema(
  {},
  { timestamps: true },
);
<%= singular(classify(name)) %>Schema.plugin(mongoosePaginate);

export {
  <%= singular(classify(name)) %>_MODEL,
  <%= singular(classify(name)) %>Schema,
};
