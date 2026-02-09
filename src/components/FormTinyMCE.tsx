'use client';

import { Box, FormHelperText, Typography } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { Control, Controller } from 'react-hook-form';

type FormTinyMCEProps = {
    name: string;
    control: Control<any>;
    label?: string;
    height?: number;
    required?: boolean;
};

export default function FormTinyMCE({
    name,
    control,
    label,
    height = 400,
    required,
}: FormTinyMCEProps) {
    return (
        <Controller
            name={name}
            control={control}
            rules={{ required }}
            render={({ field, fieldState }) => (
                <Box sx={{ width: '100%' }}>
                    {label && (
                        <Typography
                            variant="subtitle2"
                            sx={{ mb: 1, fontWeight: 500 }}
                        >
                            {label}
                        </Typography>
                    )}

                    <Editor
                        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'f9ktuir6ojue58jjipwb83a997lszn3ut2ppmdg4zve0fcpk'}
                        value={field.value || ''}
                        onEditorChange={(content) => field.onChange(content)}
                        init={{
                            height,
                            menubar: false,
                            branding: false,
                            plugins: [
                                'advlist',
                                'autolink',
                                'lists',
                                'link',
                                'image',
                                'charmap',
                                'preview',
                                'anchor',
                                'searchreplace',
                                'visualblocks',
                                'code',
                                'fullscreen',
                                'insertdatetime',
                                'media',
                                'table',
                                'help',
                                'wordcount',
                            ],
                            toolbar:
                                'undo redo | formatselect | ' +
                                'bold italic underline | forecolor | ' +
                                'alignleft aligncenter alignright alignjustify | ' +
                                'bullist numlist outdent indent | ' +
                                'removeformat | link image media | code fullscreen',
                            content_style:
                                'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        }}
                    />

                    {fieldState.error && (
                        <FormHelperText error>
                            Trường này là bắt buộc
                        </FormHelperText>
                    )}
                </Box>
            )}
        />
    );
}
