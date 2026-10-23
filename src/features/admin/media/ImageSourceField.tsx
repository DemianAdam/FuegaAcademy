import { useRef, useState } from 'react';
import { useMutation } from 'convex/react';
import { anyApi } from 'convex/server';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { ImageSource } from '@shared/validators/media';
import { Input } from '@/components/ui';

const maxImageBytes = 5 * 1024 * 1024;
const acceptedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

type Props = {
  label: string;
  value: ImageSource;
  previewUrl?: string;
  onChange: (value: ImageSource) => void;
};

export function ImageSourceField({ label, value, previewUrl, onChange }: Props) {
  const generateUploadUrl = useMutation(anyApi.media.mutations.generateUploadUrl);
  const registerUpload = useMutation(anyApi.media.mutations.registerUpload);
  const [mode, setMode] = useState<ImageSource['kind']>(value.kind);
  const [lastExternalUrl, setLastExternalUrl] = useState('');
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const externalUrl = value.kind === 'external' ? value.url : lastExternalUrl;

  const selectExternal = () => {
    setMode('external');
    if (externalUrl) onChange({ kind: 'external', url: externalUrl });
  };

  const uploadFile = async (file: File) => {
    setError(null);
    if (!acceptedTypes.has(file.type) || file.size > maxImageBytes) {
      setError('Seleccioná una imagen JPEG, PNG, WebP o GIF de hasta 5 MB.');
      return;
    }
    setIsUploading(true);
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    try {
      const uploadUrl = await generateUploadUrl({});
      const response = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
      if (!response.ok) throw new Error('No se pudo subir la imagen.');
      const { storageId } = await response.json() as { storageId: Id<'_storage'> };
      await registerUpload({ storageId });
      setMode('storage');
      onChange({ kind: 'storage', storageId });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'No se pudo subir la imagen.');
      URL.revokeObjectURL(objectUrl);
      setLocalPreview(null);
    } finally {
      setIsUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  const shownPreview = mode === 'storage' ? localPreview ?? previewUrl : externalUrl;

  return <fieldset className="space-y-2 rounded-xl border border-outline-variant bg-surface p-3">
    <legend className="px-1 text-sm font-medium">{label}</legend>
    <div className="flex gap-4 text-sm">
      <label className="flex items-center gap-2"><input type="radio" checked={mode === 'external'} onChange={selectExternal} /> URL externa</label>
      <label className="flex items-center gap-2"><input type="radio" checked={mode === 'storage'} onChange={() => { setLastExternalUrl(externalUrl); setMode('storage'); fileInput.current?.click(); }} /> Subir imagen</label>
    </div>
    <input ref={fileInput} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadFile(file); }} />
    {mode === 'external' ? <Input required placeholder="https://…" value={externalUrl} onChange={(event) => { const url = event.target.value; setLastExternalUrl(url); if (url) onChange({ kind: 'external', url }); }} /> : <div className="space-y-2"><button type="button" className="rounded-lg border border-outline-variant px-3 py-2 text-sm" disabled={isUploading} onClick={() => fileInput.current?.click()}>{isUploading ? 'Subiendo…' : 'Elegir imagen'}</button><p className="text-xs text-on-surface-variant">JPEG, PNG, WebP o GIF; máximo 5 MB.</p></div>}
    {shownPreview && <img className="h-28 w-40 rounded-lg object-cover" src={shownPreview} alt={`Vista previa de ${label}`} />}
    {error && <p role="alert" className="text-xs text-error">{error}</p>}
  </fieldset>;
}
