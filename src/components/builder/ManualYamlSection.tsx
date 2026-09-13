'use client';

import React from 'react';
import { ManualYamlEditor } from '../manual/ManualYamlEditor';

export const ManualYamlSection: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* Embedded Manual YAML Editor */}
      <ManualYamlEditor embeddedInBuilder={true} />
    </div>
  );
};

