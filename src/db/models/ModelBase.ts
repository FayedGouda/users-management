import mongoose from "mongoose";

export abstract class ModelBase {
    abstract name: string;
    abstract model: mongoose.Model<mongoose.Document>;
    abstract attributes: mongoose.Schema;
    abstract define(): mongoose.Model<any>;

}