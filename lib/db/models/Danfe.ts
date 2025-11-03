import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IDanfe extends Document {
  chaveAcesso: string;
  dados: Record<string, unknown>;
  consultadoEm: Date;
  atualizadoEm: Date;
}

const DanfeSchema = new Schema<IDanfe>(
  {
    chaveAcesso: {
      type: String,
      required: true,
      length: 44,
      match: /^\d{44}$/,
    },
    dados: {
      type: Schema.Types.Mixed,
      required: true,
    },
    consultadoEm: {
      type: Date,
      default: Date.now,
    },
    atualizadoEm: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: 'danfes',
  }
);

// Índice único para otimizar buscas por chave de acesso
DanfeSchema.index({ chaveAcesso: 1 }, { unique: true });

// Middleware para atualizar atualizadoEm automaticamente
DanfeSchema.pre('save', function (next) {
  this.atualizadoEm = new Date();
  next();
});

// Previne recompilação do modelo em desenvolvimento (Hot Reload)
const Danfe: Model<IDanfe> =
  mongoose.models.Danfe || mongoose.model<IDanfe>('Danfe', DanfeSchema);

export default Danfe;
